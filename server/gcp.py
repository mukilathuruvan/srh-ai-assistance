from google.cloud import texttospeech, translate_v3 as translate, storage
import os
import time


client = texttospeech.TextToSpeechClient()


def synthesize_speech(text):
    """Synthesizes speech from the given text using Cloud Text-to-Speech."""

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
