const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 5001;

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  credentials: true, // Allow cookies and credentials
}));

// Middleware
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// API endpoint to fetch emails
app.get('/api/emails', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM processed_emails ORDER BY received_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


const nodemailer = require('nodemailer');

// Create a transporter object using Gmail's SMTP server
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'piouspranjay@gmail.com', // Your Gmail address
    pass: 'hxpj tbal sbdj jfpg', // Your Gmail password or app password
  },
});

// API endpoint to send emails
app.post('/api/send-email', async (req, res) => {
  console.log('Request body:', req.body);
  try {
    const { to, subject, body, email_id } = req.body;

    // Fetch the original email content from the database using `raw_content`
    const originalEmailResult = await pool.query(
      'SELECT raw_content FROM processed_emails WHERE email_id = $1',
      [email_id]
    );

    if (originalEmailResult.rows.length === 0) {
      throw new Error('Original email not found');
    }

    const originalContent = originalEmailResult.rows[0].raw_content;

    // Prepend the response to the original content
    const updatedContent = `${body}\n\n|||\n${originalContent}`;

    // Update the database with the new combined content in the `raw_content` column
    await pool.query(
      'UPDATE processed_emails SET raw_content = $1, processing_status = $2 WHERE email_id = $3',
      [updatedContent, 'in progress', email_id]
    );

// In /api/close-issue
await pool.query(
  'UPDATE processed_emails SET processing_status = $1, processed_at = NOW() WHERE email_id = $2 RETURNING *',
  ['completed', email_id]
);

    // Send the email using nodemailer
    const mailOptions = {
      from: 'piouspranjay@gmail.com',
      to,
      subject,
      text: body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    res.status(200).json({ message: 'Email sent successfully and database updated' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email and update database' });
  }
});
app.post('/api/close-issue', async (req, res) => {
  try {
    const { email_id } = req.body;

    // Update the processing_status to 'completed' and set processed_at to the current time
    const result = await pool.query(
      'UPDATE processed_emails SET processing_status = $1, processed_at = NOW() WHERE email_id = $2 RETURNING *',
      ['completed', email_id]
    );

    if (result.rows.length === 0) {
      throw new Error('Email not found');
    }

    res.status(200).json({ message: 'Issue closed successfully', email: result.rows[0] });
  } catch (error) {
    console.error('Error closing issue:', error);
    res.status(500).json({ error: 'Failed to close issue' });
  }
});