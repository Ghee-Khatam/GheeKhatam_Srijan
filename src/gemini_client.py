import os
from google import genai
from google.genai import types

class GeminiClient:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable not set")
        self.client = genai.Client(api_key=self.api_key)
        self.models = [
            "gemini-3.8-flash",
            "gemini-3.7-flash",
            "gemini-3.6-flash",
            "gemini-2.5-pro",
            "gemini-2.5-flash"
        ]

    def generate(self, prompt, schema=None):
        for model in self.models:
            try:
                print(f"Attempting generation with model: {model}")
                config = types.GenerateContentConfig(temperature=0.7)
                if schema:
                    config.response_mime_type = "application/json"
                    config.response_schema = schema
                
                response = self.client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=config
                )
                print(f"Successfully generated using {model}")
                return response.text
            except Exception as e:
                print(f"Model {model} failed: {e}")
        raise Exception("All models in the fallback chain failed.")

gemini_client = GeminiClient()
