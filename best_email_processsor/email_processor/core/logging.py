import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

def log_error(error: Exception, context: str = ""):
    """Log errors with context."""
    logger.error(f"Error in {context}: {str(error)}", exc_info=True)