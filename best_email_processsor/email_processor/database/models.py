from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class ProcessingStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"

class ProcessedEmail(BaseModel):
    email_id: str
    subject: str
    sender: str
    received_at: datetime
    processed_at: datetime
    processing_status: ProcessingStatus
    raw_content: str
    junk: bool
    product_issue: bool
    personal_issue: bool
    delivery_issue: bool
    payment_issue: bool
    priority: int
    completed: bool

class ProcessingLog(BaseModel):
    log_id: str
    email_id: str
    timestamp: datetime
    log_level: str
    message: str