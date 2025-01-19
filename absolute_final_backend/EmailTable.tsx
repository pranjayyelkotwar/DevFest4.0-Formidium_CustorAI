import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';  // Importing the necessary function to calculate time difference
import { Search, Mail } from 'lucide-react';
import { Email } from '../types/email'; // Import the shared Email type

interface EmailTableProps {
  emails: Email[];
  onOpenResponse: (email: Email) => void;
}

export function EmailTable({ emails, onOpenResponse }: EmailTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmails = emails.filter((email) =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-red-100 text-red-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1:
        return 'High';
      case 2:
        return 'Medium';
      case 3:
        return 'Low';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search emails..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <tbody className="divide-y divide-gray-200">
            {filteredEmails.map((email) => (
              <tr
                key={email.email_id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onOpenResponse(email)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail className="mr-2" size={16} />
                    <span className="text-sm font-medium text-gray-900">{email.subject}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                      email.priority
                    )}`}
                  >
                    {getPriorityText(email.priority)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
