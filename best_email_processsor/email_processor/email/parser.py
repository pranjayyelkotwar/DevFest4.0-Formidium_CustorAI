from typing import Dict

class EmailParser:
    """Parses email content into a structured format."""
    
    @staticmethod
    def parse(email_data: Dict) -> Dict:
        """Parse email data into a structured format."""
        return {
            "subject": email_data.get("subject", ""),
            "sender": email_data.get("sender", ""),
            "body": email_data.get("body", ""),
        }