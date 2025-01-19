export type Email = {
    email_id: string;
    subject: string;
    sender: string;
    received_at: string;
    processed_at: string;
    processing_status: string;
    raw_content: string;
    junk: boolean;
    product_issue: boolean;
    personal_issue: boolean;
    delivery_issue: boolean;
    payment_issue: boolean;
    priority: number;
    rag_id: number;
  };