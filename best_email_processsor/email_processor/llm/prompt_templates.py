from typing import Dict

class PromptTemplates:
    """Templates for LLM prompts."""
    
    @staticmethod
    def get_default_prompt(email_content: Dict) -> str:
        """Generate a default prompt for email processing."""
        return f"""
        Process the following email:
        Subject: {email_content["subject"]}
        Sender: {email_content["sender"]}
        Body: {email_content["body"]}
        """