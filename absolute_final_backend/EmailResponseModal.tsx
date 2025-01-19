import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Email } from '../types/email'; // Import the shared Email type

interface EmailResponseModalProps {
  email: Email;
  onClose: () => void;
  onSend: (to: string, subject: string, body: string) => Promise<void>;
}

export function EmailResponseModal({ email, onClose, onSend }: EmailResponseModalProps) {
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  // Reference to the email body container for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    try {
      setSending(true);
      await onSend(email.email_id, `Re: ${email.subject}`, body);
      onClose();
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Automatically scroll to the bottom when the component updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [email.raw_content]);

  // Split the email body into messages based on "|||"
  const emailMessages = email.raw_content.split('|||');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Activity</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Email Body Section with individual message boxes */}
            <div className="space-y-2 overflow-y-auto max-h-80">
              {emailMessages.map((message, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm"
                >
                  <p className="text-sm text-gray-700">{message.trim()}</p>
                </div>
              ))}
              {/* Reference to scroll to the bottom */}
              <div ref={messagesEndRef} />
            </div>

            {/* Response Text Area (smaller) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Response</label>
              <textarea
                rows={6}  // Reduced the number of rows to make it smaller
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                placeholder="Type your response here..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={sending || !body.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : 'Send Response'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
