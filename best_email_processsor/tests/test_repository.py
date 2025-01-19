import random
import string
from datetime import datetime, timedelta
from uuid import uuid4
import json
from email_processor.database.repository import DatabaseRepository

def generate_random_email_data():
    """Generate random email data for testing."""
    email_id = str(uuid4())  # Generate a valid UUID
    subject = ''.join(random.choices(string.ascii_letters + ' ', k=20))
    sender = f"{''.join(random.choices(string.ascii_letters, k=5))}@example.com"
    received_at = datetime.now() - timedelta(days=random.randint(1, 30))
    processed_at = datetime.now()

    # Use valid values for processing_status based on the ProcessingStatus enum
    processing_status = random.choice(["pending", "completed", "failed"])

    # Generate JSON-compatible content
    raw_content = ''.join(random.choices(string.ascii_letters + ' ', k=100))
    processed_content = {
        "text": ''.join(random.choices(string.ascii_letters + ' ', k=100)),
        "metadata": {
            "length": random.randint(50, 200),
            "language": random.choice(["en", "fr", "es"]),
        },
    }

    return {
        "email_id": email_id,
        "subject": subject,
        "sender": sender,
        "received_at": received_at,
        "processed_at": processed_at,
        "processing_status": processing_status,
        "raw_content": raw_content,
        "processed_content": json.dumps(processed_content),  # Convert to JSON string
    }

def print_table_contents(repository):
    """Print the contents of the `processed_emails` table."""
    conn = repository.connection_pool.getconn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM processed_emails")
    rows = cursor.fetchall()

    print("\nContents of the `processed_emails` table:")
    for row in rows:
        print(row)

    repository.connection_pool.putconn(conn)

def main():
    # Initialize the repository
    repository = DatabaseRepository()

    # Generate random email data
    email_data = generate_random_email_data()
    print("Generated email data:")
    for key, value in email_data.items():
        print(f"{key}: {value}")

    # Insert the email data into the database
    print("\nInserting email data into the database...")
    if repository.insert_processed_email(email_data):
        print("Email data inserted successfully!")
    else:
        print("Failed to insert email data.")

    # Print the contents of the table after insertion
    print_table_contents(repository)

    # Clean up: Close the connection pool
    repository.connection_pool.closeall()

if __name__ == "__main__":
    main()