import openai
import os
import re
import time
from werkzeug.serving import run_simple
from gemini_ai import system_instruction

openai.api_key = os.getenv("")

class AppOpenAI:
    def __init__(self):
        self.client = openai.ChatCompletion

    def validate_prompt(self, prompt):
        if not prompt:
            raise ValueError("Prompt cannot be empty.")

        if len(prompt) > 1000:
            raise ValueError(
                "Prompt is too long. Please keep it under 1000 characters."
            )

        if re.search(r"[^\w\s]", prompt):
            raise ValueError(
                "Prompt contains special characters. Please avoid using special characters."
            )

        if not prompt.strip():
            raise ValueError("Prompt cannot be empty after removing whitespace.")

        return True

    def generate_response(self, prompt: str):
        try:
            if not self.validate_prompt(prompt):
                return None

            start_time = time.time()

            response = self.client.create(
                model="ft:gpt-4o-mini-2024-07-18:personal::B2IoJDW",
                messages=[
                    {"role": "system", "content": system_instruction[0]},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=8192,
                temperature=1,
                top_p=0.95
            )

            end_time = time.time()
            response_time = round(end_time - start_time, 2)

            return {
                "content": response['choices'][0]['message']['content'],
                "response_time": response_time,
            }

        except Exception as e:
            print(f"Error generating OpenAI response: {e}")
            return None
