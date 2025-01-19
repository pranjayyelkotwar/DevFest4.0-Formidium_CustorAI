# Email Management System

## Setup Instructions

1. **Supabase Setup**
   - Click the "Connect to Supabase" button in the top right corner
   - Once connected, copy the project URL and anon key
   - Create a `.env` file in the root directory using `.env.example` as a template
   - Paste your Supabase credentials into the `.env` file:
     ```
     VITE_SUPABASE_URL=your-project-url
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

## Features

- Email listing with search and filtering
- Priority-based email management
- Detailed email view with issue classifications
- Email response system
- Analytics dashboard with charts

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Supabase
- Recharts for data visualization