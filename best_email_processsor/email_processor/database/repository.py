import psycopg2
from psycopg2 import pool
from psycopg2.extras import execute_values
from email_processor.core.config import settings
from email_processor.core.logging import log_error
from datetime import datetime
from email.utils import parsedate_to_datetime
from email_processor.database.models import ProcessedEmail, ProcessingLog  # Import your models
import re

class DatabaseRepository:
    """Handles database operations, including table creation."""

    def __init__(self):
        # Initialize the connection pool
        self.connection_pool = psycopg2.pool.SimpleConnectionPool(
            1, 10,
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            dbname=settings.DB_NAME,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
        )

        # Create tables at instantiation
        # self._create_tables()

    def _create_tables(self):
        """Create database tables based on the models."""
        try:
            conn = self.connection_pool.getconn()
            cursor = conn.cursor()

            # Drop existing tables if they exist
            cursor.execute("DROP TABLE IF EXISTS processed_emails CASCADE;")
            cursor.execute("DROP TABLE IF EXISTS processing_logs CASCADE;")

            # Create the processed_emails table with a composite primary key
            cursor.execute("""
                CREATE TABLE processed_emails (
                    email_id TEXT,
                    subject TEXT,
                    sender TEXT,
                    received_at TIMESTAMP,
                    processed_at TIMESTAMP,
                    processing_status TEXT,
                    raw_content TEXT,
                    junk BOOLEAN,
                    product_issue BOOLEAN,
                    personal_issue BOOLEAN,
                    delivery_issue BOOLEAN,
                    payment_issue BOOLEAN,
                    priority INTEGER,
                    PRIMARY KEY (email_id, subject)
                );
            """)

            # Create the processing_logs table
            cursor.execute("""
                CREATE TABLE processing_logs (
                    log_id TEXT PRIMARY KEY,
                    email_id TEXT,
                    subject TEXT,
                    timestamp TIMESTAMP,
                    log_level TEXT,
                    message TEXT,
                    FOREIGN KEY (email_id, subject) REFERENCES processed_emails(email_id, subject)
                );
            """)

            conn.commit()
            print("Tables created successfully.")
        except Exception as e:
            log_error(f"Error creating tables: {e}", "DatabaseRepository._create_tables")
            raise e
        finally:
            self.connection_pool.putconn(conn)

    def _is_reply_subject(self, subject: str, original_subject: str) -> bool:
        """Check if the subject is a reply to the original subject."""
        return subject.strip().lower() == f"re: {original_subject.strip().lower()}"

    def insert_processed_email(self, email_data: dict) -> bool:
        """Insert processed email into the database or update existing email if it's a reply."""
        try:
            conn = self.connection_pool.getconn()
            cursor = conn.cursor()

            # Parse the RFC 2822 date string into a datetime object
            received_at = parsedate_to_datetime(email_data["time"])

            reply_pattern = re.compile(r"^(re:|fwd:)\s*", re.IGNORECASE)
            original_subject = reply_pattern.sub("", email_data["subject"]).strip()

            # Check if an email with the same email_id and the original subject exists
            cursor.execute(
                """
                SELECT subject, raw_content FROM processed_emails
                WHERE email_id = %s AND subject = %s;
                """,
                (email_data["email_id"], original_subject)
            )
            existing_email = cursor.fetchone()


            if existing_email:
                # If an existing email is found, prepend the new body to the original body
                print("Existing email found.")
                original_subject, original_body = existing_email
                updated_body = f"{email_data['body']}\n\n|||\n{original_body}"

                # Update the existing email with the new body
                cursor.execute(
                    """
                    UPDATE processed_emails
                    SET raw_content = %s, processed_at = %s
                    WHERE email_id = %s AND subject = %s;
                    """,
                    (updated_body, datetime.now(), email_data["email_id"], original_subject)
                )
            else:
                # If no existing email is found, insert a new record
                cursor.execute(
                    """
                    INSERT INTO processed_emails (
                        email_id, subject, sender, received_at, processed_at,
                        processing_status, raw_content, junk, product_issue,
                        personal_issue, delivery_issue, payment_issue, priority
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        email_data.get("email_id", "N/A"),
                        email_data["subject"],
                        email_data["sender"],
                        received_at,
                        datetime.now(),
                        "in progress",
                        email_data["body"],
                        email_data.get("junk", False),
                        email_data.get("product_issue", False),
                        email_data.get("personal_issue", False),
                        email_data.get("delivery_issue", False),
                        email_data.get("payment_issue", False),
                        email_data.get("priority", 1),
                    ),
                )

            conn.commit()
            return True
        except Exception as e:
            log_error(f"Error in DatabaseRepository.insert_processed_email: {e}", "DatabaseRepository.insert_processed_email")
            return False
        finally:
            self.connection_pool.putconn(conn)