import openai
import os

# Initialize the OpenAI client with your API key
openai.api_key = os.getenv("OPEN_API_KEY")

# Create the fine-tuning job with DPO
# job = openai.fine_tuning.jobs.create(
# training_file="file-8Q8Jy2TB3FoMRiEEKoFzyz",  # Replace with your file ID
# model="gpt-4o-mini-2024-07-18",
# method={
# "type": "supervised",

#  }
# )

# Print the response
# print(job)

# Retrieve the state of a specific fine-tuning jobjob_id = "ftjob-5A4FQvsnwJIHirzpv79QCK8c"job_status = openai.fine_tuning.jobs.retrieve(job_id)print(f"Status of job {job_id}:", job_status)


job_id = "ftjob-qaKbplJr5W7KczhL7RIhtRJr"
status = openai.fine_tuning.jobs.retrieve(job_id)
print("Job status:", status.status)


# Your fine-tuning job ID
job_id = "ftjob-qaKbplJr5W7KczhL7RIhtRJr"

# Retrieve job details
job = openai.fine_tuning.jobs.retrieve(job_id)

# Get the fine-tuned model ID
model_id = job.fine_tuned_model

print(f"Fine-tuned Model ID: {model_id}")