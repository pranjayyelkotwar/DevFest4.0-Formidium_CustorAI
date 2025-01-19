import imaplib
import email
import re  # Import the regex module
from email import policy
from typing import List, Dict
from email_processor.core.config import settings
from email_processor.core.logging import log_error

class EmailReader:
    """Reads emails from an IMAP server."""
    
    def __init__(self):
        self.mail = imaplib.IMAP4_SSL(settings.EMAIL_HOST)
    
    def connect(self) -> bool:
        """Connect to the email server."""
        try:
            self.mail.login(settings.EMAIL_USER, settings.EMAIL_PASSWORD)
            self.mail.select("inbox")
            return True
        except Exception as e:
            log_error(e, "EmailReader.connect")
            return False
    
    def fetch_emails(self, count: int = None) -> List[Dict]:
        """
        Fetch unread emails.
        
        Args:
            count (int): Number of latest unread emails to fetch. If None, fetch all unread emails.
        
        Returns:
            List[Dict]: A list of dictionaries containing email details.
        """
        emails = []
        try:
            # Search for unread emails
            status, messages = self.mail.search(None, "UNSEEN")
            if status == "OK":
                # Get the list of email IDs
                msg_ids = messages[0].split()
                
                # If count is specified, fetch only the latest `count` emails
                if count is not None and count > 0:
                    msg_ids = msg_ids[-count:]  # Get the last `count` emails (latest ones)
                
                for msg_id in msg_ids:
                    status, msg_data = self.mail.fetch(msg_id, "(RFC822)")
                    if status == "OK":
                        raw_email = msg_data[0][1]
                        email_message = email.message_from_bytes(raw_email, policy=policy.default)
                        
                        # Extract the email_id from the sender field using regex
                        sender = email_message["from"]
                        email_id_match = re.search(r"<([^>]+)>", sender)  # Find the email inside <>
                        
                        # Set email_id to the extracted email or 'Unknown' if no match
                        email_id = email_id_match.group(1) if email_id_match else "Unknown"
                        
                        emails.append({
                            "email_id": email_id,  # Use the extracted email_id
                            "subject": email_message["subject"],
                            "sender": sender,
                            "time": email_message["date"],  # Add the email time
                            "body": self._get_email_body(email_message),
                            "rag_id": 0
                        })
        except Exception as e:
            log_error(e, "EmailReader.fetch_emails")
        return emails
    
    def _get_email_body(self, email_message) -> str:
        """Extract the email body."""
        body = ""
        if email_message.is_multipart():
            for part in email_message.walk():
                if part.get_content_type() == "text/plain":
                    body = part.get_payload(decode=True).decode()
                    break
        else:
            body = email_message.get_payload(decode=True).decode()
        return body