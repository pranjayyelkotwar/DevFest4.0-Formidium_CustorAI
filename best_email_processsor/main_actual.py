import schedule
import time
from email_processor.email.reader import EmailReader
from email_processor.llm.processor import LLMProcessor
from email_processor.database.repository import DatabaseRepository

def process_emails():
    """Main function to process emails."""
    reader = EmailReader()
    if reader.connect():
        emails = reader.fetch_emails(count=1)
        llm = LLMProcessor()
        db = DatabaseRepository()
        for email_data in emails:
            processed_data = llm.process(email_data)
            db.insert_processed_email(processed_data)

if __name__ == "__main__":
    # schedule.every().hour.do(process_emails)
    # while True:
    #     schedule.run_pending()
    #     time.sleep(1)
    print("Processing emails...")
    process_emails()