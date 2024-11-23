// Import dependencies
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file

// Create an Express app
const app = express();
const PORT = process.env.PORT || 5001;  // Use environment variable for PORT if available

// Middleware
app.use(cors({
  origin: 'https://amharic-app.netlify.app',  // Allow your Netlify URL
  methods: ['GET', 'POST'],                   // Allow the required HTTP methods
  credentials: true
}));

// Middleware for parsing JSON data
app.use(express.json());  // Use built-in express body-parser for JSON data

// Endpoint to handle feedback
app.post('/send-feedback', (req, res) => {
  const { name, email, message } = req.body;

  // Nodemailer transporter setup
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gezageta@gmail.com',              // Your email address
      pass: process.env.GMAIL_APP_PASSWORD,    // Use app password from environment variable
    },
  });

  // Mail options
  const mailOptions = {
    from: email,
    to: 'gezageta@gmail.com',
    subject: `Feedback from ${name}`,
    text: message,
  };

  // Send mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Feedback sent successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
