from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from gcp import synthesize_speech, translate_text, save_file
import base64
from models.gemini_ai import AppGemini
from models.chatgpt.chatgpt import AppOpenAI


app = Flask(__name__)
CORS(app)

load_dotenv()


@app.route("/api", methods=["GET"])
def home():
    return "SRH AI Assitance API"


@app.route("/api/chat", methods=["POST"])
def ask_ai():
    try:
        prompt = request.form.get("prompt")
        files = request.files.getlist("file")

        file = files[0] if files and len(files) > 0 else None

        if not prompt or len(prompt) == 0:
            return jsonify({"error": "Prompt parameter is required"}), 400

        app_gemini = AppGemini()
        app_chatgpt = AppOpenAI()

        if file:
            file_url = save_file(file)
            prompt = f"File {file_url} and Query {prompt}"

        gemini_response = app_gemini.generate_response(prompt)
        gpt_response = app_chatgpt.generate_response(prompt)

        if gpt_response and gemini_response:
            return (
                jsonify(
                    {
                        "gemini": gemini_response,
                        "openai": gpt_response,
                    }
                ),
                200,
            )

        return jsonify({"response": "I couldn't understand you query"}), 401

    except Exception as e:
        print(f"Error while handling /chat endpoint: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/speak", methods=["POST"])
def speak():
    data = request.json
    text = data.get("text")
    language_code = data.get("language", "en-US")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    try:
        translated_text = translate_text(text, language_code)
        audio_content = synthesize_speech(translated_text)

        # Return base64 encoded audio
        audio_base64 = base64.b64encode(audio_content).decode("utf-8")
        return jsonify({"audio": audio_base64}), 200

    except Exception as e:
        print(f"Error synthesizing speech: {e}")
        return jsonify({"error": "Error synthesizing speech"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
