import schedule
import time
from email_processor.email.reader import EmailReader
from email_processor.llm.processor import LLMProcessor
from email_processor.database.repository import DatabaseRepository

def process_emails():
    """Main function to process emails."""
    reader = EmailReader()
    if reader.connect():
        print("Connected to email server.")
        print("Fetching emails...")
        emails = reader.fetch_emails(count=1)
        print("Emails fetched:", len(emails))
        print("Processing emails...")
        print("LLM processing...")
        llm = LLMProcessor()
        db = DatabaseRepository()
        for email_data in emails:
            processed_data = llm.process(email_data)
            # print("Processed data:", processed_data)
            print("Inserting processed email into the database...")
            db.insert_processed_email(processed_data)
            # print(email_data)

if __name__ == "__main__":
    # schedule.every().hour.do(process_emails)
    # while True:
        # schedule.run_pending()
        # time.sleep(1)
    process_emails()