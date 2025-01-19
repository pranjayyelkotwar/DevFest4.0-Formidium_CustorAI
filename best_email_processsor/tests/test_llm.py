from email_processor.llm.processor import LLMProcessor
import json

def test_llm_processor():
    """Test the LLMProcessor class."""
    # Example email content
    email_content = {
        "subject": "Issue with my recent order",
        "sender": "customer@example.com",
        "time": "2025-01-18 12:34:56",
        "body": "Hi, I recently ordered a product, but it hasn't been delivered yet. Can you help?"
    }

    # Initialize the LLMProcessor
    llm_processor = LLMProcessor()

    # Process the email
    result = llm_processor.process(email_content)

    # Print the result
    print("LLM Processor Result:")
    print(json.dumps(result, indent=4))

if __name__ == "__main__":
    test_llm_processor()