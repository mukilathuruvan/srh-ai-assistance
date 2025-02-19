import requests
import os

# Replace with your OpenAI API key
api_key = os.getenv("OPEN_API_KEY")

# File path to upload
file_path = r"C:\Users\Adham Moursy\Desktop\openaidataset.jsonl"

# Define the API endpoint
url = "https://api.openai.com/v1/files"

# Prepare the request
files = {"file": open(file_path, "rb")}
data = {
    "purpose": "fine-tune"  # Change to 'assistants' if you're using the Assistants API
}

# Make the request
response = requests.post(
    url, headers={"Authorization": f"Bearer {api_key}"}, files=files, data=data
)

# Print the response
print(response.json())

# Replace with the file_id you want to retrieve
file_id = "file-8Q8Jy2TB3FoMRiEEKoFzyz"

# Define the API endpoint
url = f"https://api.openai.com/v1/files/{file_id}"

# Make the GET request
response = requests.get(url, headers={"Authorization": f"Bearer {api_key}"})

# Print the response
print(response.json())