from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from models.gemini import AppGemini
from models.chatgpt import AppChatGPT

app = Flask(__name__)
CORS(app)

load_dotenv()


@app.route("/api", methods=["GET"])
def home():
    return "SRH AI Assitance API"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
