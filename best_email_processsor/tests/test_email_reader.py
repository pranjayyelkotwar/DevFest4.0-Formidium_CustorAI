from email_processor.email.reader import EmailReader

def test_email_reader(count: int = None):
    """Test the EmailReader class by fetching unread emails."""
    reader = EmailReader()
    
    # Connect to the email server
    if reader.connect():
        print("Connected to the email server successfully!")
        
        # Fetch unread emails
        emails = reader.fetch_emails(count)
        
        if emails:
            print(f"\nFetched {len(emails)} unread email(s):")
            for i, email in enumerate(emails, start=1):
                print(f"\nEmail {i}:")
                print(f"Subject: {email['subject']}")
                print(f"From: {email['sender']}")
                print(f"Body: {email['body']}")
        else:
            print("No unread emails found.")
    else:
        print("Failed to connect to the email server.")

if __name__ == "__main__":
    # Specify the number of latest unread emails to fetch
    count = 3  # Change this value to fetch a different number of emails
    test_email_reader(count)