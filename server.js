require('dotenv').config();  // Load environment variables from a .env file
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({
  origin: 'https://amharic-app.netlify.app',  // Allow your Netlify URL
  methods: 'GET,POST',                         // Allow the required HTTP methods
  credentials: true
}));
app.use(express.json());  // Use built-in express body-parser for JSON data

// Feedback route
app.post('/send-feedback', (req, res) => {
  const { name, email, message } = req.body;

  // Create transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Use environment variable for email address
      pass: process.env.EMAIL_PASS,  // Use environment variable for app-specific password
    },
  });

  // Set up email data
  const mailOptions = {
    from: email,
    to: 'gezageta@gmail.com',
    subject: `Feedback from ${name}`,
    text: message,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Feedback sent successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
