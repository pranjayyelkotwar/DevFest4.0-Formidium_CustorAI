import re
from typing import Dict
from email_processor.core.config import settings
from email_processor.core.logging import log_error
from g4f.client import Client

class LLMProcessor:
    """Processes email content using the g4f library."""
    
    def __init__(self):
        self.client = Client()
        self.model = "gpt-4"  # You can change this to any supported model
    
    def process(self, email_content: Dict) -> Dict:
        """
        Process email content and classify it into categories with a priority value.
        
        Args:
            email_content (Dict): A dictionary containing email details (subject, sender, time, body).
        
        Returns:
            Dict: A JSON response with classification and priority.
        """
        try:
            # Construct the prompt
            prompt = (
                f"Email Subject: {email_content['subject']}\n"
                f"Sender: {email_content['sender']}\n"
                f"Time: {email_content['time']}\n"
                f"Body: {email_content['body']}\n\n"
                "Classify this email into the following categories and assign a priority (1-3):\n"
                "- Junk (true/false)\n"
                "- Product Issue (true/false)\n"
                "- Personal Issue (true/false)\n"
                "- Delivery Issue (true/false)\n"
                "- Payment Issue (true/false)\n"
                "- Priority (1-3)\n"
                "Return the response as a JSON object with the following keys: "
                '"junk", "product_issue", "personal_issue", "delivery_issue", "payment_issue", "priority".'
            )
            
            # Make the API call
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Extract the response content
            response_content = response.choices[0].message.content.strip()
            
            # Debug: Print the raw response for inspection
            print("Raw API Response:", response_content)
            
            # Validate the response
            if not response_content:
                log_error("Empty response from the API.", "LLMProcessor.process")
                return {}
            
            # Remove Markdown code block markers (```json and ```)
            response_content = re.sub(r'```json|```', '', response_content).strip()
            
            # Use regex to extract key-value pairs
            result = {}
            pattern = r'"(\w+)":\s*(".*?"|\d+|true|false)'
            matches = re.findall(pattern, response_content)
            
            for key, value in matches:
                # Convert value to the correct type
                if value.lower() == "true":
                    value = True
                elif value.lower() == "false":
                    value = False
                elif value.isdigit():
                    value = int(value)
                elif value.startswith('"') and value.endswith('"'):
                    value = value[1:-1]  # Remove quotes
                
                result[key] = value
            
            # Validate the result
            required_keys = ["junk", "product_issue", "personal_issue", "delivery_issue", "payment_issue", "priority"]
            if all(key in result for key in required_keys):
                # add back the email subject , sender , time and body
                result["email_id"] = email_content["email_id"]  
                result["subject"] = email_content["subject"]
                result["sender"] = email_content["sender"]
                result["time"] = email_content["time"]
                result["body"] = email_content["body"]
                return result
            else:
                log_error("Invalid JSON structure in the response.", "LLMProcessor.process")
                return {}
                
        except Exception as e:
            log_error(f"Error in LLMProcessor.process: {e}", "LLMProcessor.process")
            return {}