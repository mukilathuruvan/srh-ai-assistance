from google.cloud import texttospeech, translate_v3 as translate, storage
from google.cloud import videointelligence_v1 as videointelligence
import os
import time


def synthesize_speech(text):
    """Synthesizes speech from the given text using Cloud Text-to-Speech."""

    client = texttospeech.TextToSpeechClient()
    synthesis_input = texttospeech.SynthesisInput(text=text)

    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    # Return the audio content (bytes)
    return response.audio_content


def translate_text(text, language_code):
    """Translates text to the target language."""
    try:
        if language_code == "en-US":
            return text

        client = translate.TranslationServiceClient()
        project_id = os.environ.get("GEMINI_PROJECT_ID")

        parent = f"projects/{project_id}/locations/global"

        response = client.translate_text(
            contents=[text],
            target_language_code=language_code,
            parent=parent,
            mime_type="text/plain",
            source_language_code="en-US",
        )
        translation = response.translations[0]

        return translation.translated_text
    except Exception as e:
        print(f"Translation Error: {e}")
        return "error during translation"


def save_file(file):
    """Saves the file to Cloud Storage and returns the public URL."""
    try:
        bucket_name = os.environ.get("GEMINI_BUCKET_NAME")

        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)

        timestamp = str(int(time.time()))
        filename = f"{timestamp}_{file.filename}"

        blob = bucket.blob(filename)
        blob.upload_from_file(file)

    except Exception as e:
        print(f"Error saving to Cloud Storage: {e}")


def detect_faces(video_name="VIDEO_ONE"):
    """Detects faces and their expressions in a video stored on GCS."""
    try:
        bucket_name = os.environ.get("GEMINI_BUCKET_NAME")
        filename = os.environ.get(video_name)

        gcs_uri = f"gs://{bucket_name}/{filename}"

        client = videointelligence.VideoIntelligenceServiceClient()

        # Configure the request
        config = videointelligence.FaceDetectionConfig(
            include_bounding_boxes=True, include_attributes=True
        )
        context = videointelligence.VideoContext(face_detection_config=config)

        # Start the asynchronous request
        operation = client.annotate_video(
            request={
                "features": [videointelligence.Feature.FACE_DETECTION],
                "input_uri": gcs_uri,
                "video_context": context,
            }
        )

        print("Processing video for face detection annotations.")
        result = operation.result(timeout=300)
        print("Finished processing.")

        # Retrieve the first result
        annotation_result = result.annotation_results[0]

        face_data = []

        for annotation in annotation_result.face_detection_annotations:
            for track in annotation.tracks:
                for frame in track.timestamped_objects:
                    seconds = 0
                    nanos = 0

                    if isinstance(frame.time_offset, dict):
                        seconds = frame.time_offset.get("seconds", 0)
                        nanos = frame.time_offset.get("nanos", 0)

                    elif hasattr(frame.time_offset, "seconds") and hasattr(
                        frame.time_offset, "nanos"
                    ):
                        seconds = (
                            frame.time_offset.seconds
                            if frame.time_offset.seconds is not None
                            else 0
                        )
                        nanos = (
                            frame.time_offset.nanos
                            if frame.time_offset.nanos is not None
                            else 0
                        )
                else:
                    frame_data = {
                        "time_offset": {
                            "seconds": seconds,
                            "nanos": nanos,
                        },
                        "attributes": [],
                    }

                    for attribute in frame.attributes:
                        frame_data["attributes"].append(
                            {
                                attribute.name: attribute.confidence,
                            }
                        )
                    face_data.append(frame_data)

        return face_data

    except Exception as e:
        print(f"Error during face detection: {e}")
        return []
