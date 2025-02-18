from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from gcp import synthesize_speech, translate_text
import base64


app = Flask(__name__)
CORS(app)

load_dotenv()


@app.route("/api", methods=["GET"])
def home():
    return "SRH AI Assitance API"


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
    app.run(host="0.0.0.0", port=8080)
