# Email Processor Application

## Setup Instructions
1. Clone the repository.
2. Install dependencies: `pip install -r requirements.txt`.
3. Create a `.env` file using `example.env` as a template.
4. Run the application: `python src/main.py`.

## Environment Variables
- `EMAIL_HOST`: IMAP server host.
- `EMAIL_USER`: Email account username.
- `EMAIL_PASSWORD`: Email account password.
- `DB_HOST`: PostgreSQL host.
- `DB_PORT`: PostgreSQL port.
- `DB_NAME`: Database name.
- `DB_USER`: Database username.
- `DB_PASSWORD`: Database password.
- `LLM_API_URL`: LLM API URL.
- `LLM_API_KEY`: LLM API key.

## Database Schema
### `processed_emails`
- `email_id`: UUID (Primary Key)
- `subject`: Text
- `sender`: Text
- `received_at`: Timestamp
- `processed_at`: Timestamp
- `processing_status`: Enum (pending, completed, failed)
- `raw_content`: Text
- `processed_content`: JSONB

### `processing_logs`
- `log_id`: UUID (Primary Key)
- `email_id`: UUID (Foreign Key)
- `timestamp`: Timestamp
- `log_level`: Enum (info, error, warning)
- `message`: Text