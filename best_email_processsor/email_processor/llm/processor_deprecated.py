import requests
from typing import Dict
from email_processor.core.config import settings
from email_processor.core.logging import log_error

class LLMProcessor:
    """Processes email content using Ollama."""
    
    def __init__(self):
        self.api_url = settings.LLM_API_URL
        self.api_key = settings.LLM_API_KEY
    
    def process(self, email_content: Dict) -> Dict:
        """Process email content using Ollama."""
        try:
            response = requests.post(
                self.api_url,
                json={
                    "model": "llama2",  # Replace with your model name
                    "prompt": email_content["body"],
                },
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            log_error(e, "LLMProcessor.process")
            return {}