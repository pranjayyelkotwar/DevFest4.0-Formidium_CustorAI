import React, { useEffect, useState } from 'react';
import { EmailTable } from './components/EmailTable';
import { EmailDetailModal } from './components/EmailDetailModal';
import { EmailResponseModal } from './components/EmailResponseModal';
import { Analytics } from './components/Analytics'; // Import the Analytics component
import { Email } from './types/email'; // Import the shared Email type

function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmails();
  }, []);

  async function fetchEmails() {
    try {
      const response = await fetch('http://localhost:5001/api/emails');
      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }
      const data = await response.json();
      setEmails(data);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenDetails = (email: Email) => {
    setSelectedEmail(email);
    setIsDetailModalOpen(true);
  };

  const handleOpenResponse = (email: Email) => {
    setSelectedEmail(email);
    setIsResponseModalOpen(true);
  };

  const handleSendEmail = async (to: string, subject: string, body: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, body, email_id: selectedEmail?.email_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      const data = await response.json();
      console.log('Email sent successfully:', data);
      fetchEmails(); // Refresh the email list
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const handleCloseIssue = async (email_id: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/close-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to close issue');
      }

      const data = await response.json();
      console.log('Issue closed successfully:', data);
      fetchEmails(); // Refresh the email list
    } catch (error) {
      console.error('Error closing issue:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Custer Ai</h1>

          

          {/* Analytics Component */}
          <Analytics emails={emails} /> {/* Add the Analytics component here */}

          {/* Modals */}
          {selectedEmail && isDetailModalOpen && (
            <EmailDetailModal
              email={selectedEmail}
              onClose={() => {
                setIsDetailModalOpen(false);
                setSelectedEmail(null);
              }}
            />
          )}
          {/* Email Table */}
          <EmailTable
            emails={emails}
            onOpenDetails={handleOpenDetails}
            onOpenResponse={handleOpenResponse}
          />
          {selectedEmail && isResponseModalOpen && (
            <EmailResponseModal
              email={selectedEmail}
              onClose={() => {
                setIsResponseModalOpen(false);
                setSelectedEmail(null);
              }}
              onSend={handleSendEmail}
              onCloseIssue={handleCloseIssue} // Pass the onCloseIssue function
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;