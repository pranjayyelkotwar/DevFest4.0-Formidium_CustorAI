import React from 'react';
import { format, formatDistanceStrict } from 'date-fns';
import { X, Check, AlertCircle, Package, CreditCard, User, Truck } from 'lucide-react';
import { Email } from '../types/email'; // Import the shared Email type

interface EmailDetailModalProps {
  email: Email;
  onClose: () => void;
}

export function EmailDetailModal({ email, onClose }: EmailDetailModalProps) {
  const processingTime = email.processed_at 
    ? formatDistanceStrict(new Date(email.processed_at), new Date(email.received_at))
    : 'Not processed';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Email Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email ID</p>
                  <p className="text-sm font-medium">{email.email_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sender</p>
                  <p className="text-sm font-medium">{email.sender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Received At</p>
                  <p className="text-sm font-medium">{format(new Date(email.received_at), 'PPp')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Processing Time</p>
                  <p className="text-sm font-medium">{processingTime}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Content</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{email.raw_content}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Issue Classifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Package size={20} className={email.product_issue ? 'text-green-500' : 'text-gray-300'} />
                  <span className="text-sm">Product Issue</span>
                  {email.product_issue && <Check size={16} className="text-green-500" />}
                </div>
                <div className="flex items-center space-x-2">
                  <Truck size={20} className={email.delivery_issue ? 'text-green-500' : 'text-gray-300'} />
                  <span className="text-sm">Delivery Issue</span>
                  {email.delivery_issue && <Check size={16} className="text-green-500" />}
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard size={20} className={email.payment_issue ? 'text-green-500' : 'text-gray-300'} />
                  <span className="text-sm">Payment Issue</span>
                  {email.payment_issue && <Check size={16} className="text-green-500" />}
                </div>
                <div className="flex items-center space-x-2">
                  <User size={20} className={email.personal_issue ? 'text-green-500' : 'text-gray-300'} />
                  <span className="text-sm">Personal Issue</span>
                  {email.personal_issue && <Check size={16} className="text-green-500" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}