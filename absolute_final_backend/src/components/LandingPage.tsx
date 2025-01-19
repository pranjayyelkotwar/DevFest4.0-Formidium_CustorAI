import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
export function LandingPage() {
    const navigate = useNavigate();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
        <h1 className="text-6xl font-bold mb-8">Welcome to Custer</h1>
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg"
        >
          <LayoutDashboard size={24} />
          Open Your Dashboard
        </button>
      </div>
  );
}