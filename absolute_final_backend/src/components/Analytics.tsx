import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Email } from '../types/email'; // Import the shared Email type

interface AnalyticsProps {
  emails: Email[];
}

export function Analytics({ emails }: AnalyticsProps) {
  // Calculate the number of open issues
  const openIssuesCount = emails.filter(e => e.processing_status !== 'completed').length;

  // Calculate the number of issues closed today
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const issuesClosedTodayCount = emails.filter(e => 
    e.processing_status === 'completed' && e.processed_at?.split('T')[0] === today
  ).length;

  // Calculate the average response time for completed issues
  const completedEmails = emails.filter(e => e.processing_status === 'completed');
  const totalResponseTime = completedEmails.reduce((sum, e) => {
    const receivedAt = new Date(e.received_at).getTime();
    const processedAt = new Date(e.processed_at).getTime();
    return sum + (processedAt - receivedAt);
  }, 0);
  const averageResponseTime = completedEmails.length > 0 
    ? (totalResponseTime / completedEmails.length) / (1000 * 60 * 60) // Convert milliseconds to hours
    : 0;

  // Prepare data for issue types bar chart
  const issueData = [
    {
      name: 'Product Issues',
      count: emails.filter(e => e.product_issue).length
    },
    {
      name: 'Delivery Issues',
      count: emails.filter(e => e.delivery_issue).length
    },
    {
      name: 'Payment Issues',
      count: emails.filter(e => e.payment_issue).length
    },
    {
      name: 'Personal Issues',
      count: emails.filter(e => e.personal_issue).length
    }
  ];

  // Prepare data for priority pie chart
  const priorityData = [
    {
      name: 'High Priority',
      value: emails.filter(e => e.priority === 1).length
    },
    {
      name: 'Medium Priority',
      value: emails.filter(e => e.priority === 2).length
    },
    {
      name: 'Low Priority',
      value: emails.filter(e => e.priority === 3).length
    }
  ];

  const COLORS = ['#ef4444', '#eab308', '#22c55e'];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>

      {/* Metrics Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Open Issues</h3>
          <p className="text-2xl font-bold text-blue-600">{openIssuesCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Issues Closed Today</h3>
          <p className="text-2xl font-bold text-green-600">{issuesClosedTodayCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Average Response Time</h3>
          <p className="text-2xl font-bold text-purple-600">{averageResponseTime.toFixed(2)} hours</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Issue Types Distribution</h3>
          <BarChart width={500} height={300} data={issueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={false} />
            <YAxis tick={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Priority Distribution</h3>
          <PieChart width={500} height={300}>
            <Pie
              data={priorityData}
              cx={250}
              cy={150}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label
            >
              {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}