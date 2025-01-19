# Custor.AI
> Smarter Customer Insights, Seamless Solutions.
--- 

# Problems Custor AI Solves 

### 1. Overwhelming Inbox Management
*Problem:* Manually extracting and organizing unread emails is time-consuming and inefficient.  
*Solution:* Custor AI uses the IMAP API to automatically fetch all recent unread emails, ensuring no query is overlooked.

### 2. Email Categorization and Prioritization
*Problem:* Sorting and tagging emails based on their content is tedious and error-prone.  
*Solution:* Each email's subject and body are sent to ChatGPT-4o via the OpenAI API, which assigns relevant tags (e.g., Product Issue, Delivery Issue). This process operates at high speed, handling up to 1000 emails in 2 minutes.

### 3. Spam Filtering
*Problem:* Spam and irrelevant emails clutter inboxes, wasting resources.  
*Solution:* Emails tagged as "Junk" by ChatGPT-4o are automatically discarded, focusing attention on meaningful queries.

### 4. Identifying Recurring Issues
*Problem:* Recurring issues are often missed without a centralized knowledge base.  
*Solution:* Tags, along with the email's content, are sent to a RAG pipeline. The pipeline identifies if a similar issue exists in the database. If it’s a new issue, it is stored in a custom RAG-oriented database for future reference.

### 5. Centralized Data Storage
*Problem:* Scattered email data leads to inefficiencies in query resolution.  
*Solution:* All emails, along with their tags, subjects, and bodies, are added to a PostgreSQL database, creating a centralized repository for easy access and analysis.

### 6. Real-Time Monitoring and Transparency
*Problem:* Lack of visibility into email statuses and team actions hampers productivity.  
*Solution:* Custor AI updates a live dashboard (built using React and Node.js) in real time, enabling the client success team to monitor email statuses, track progress, and prioritize tasks seamlessly.
