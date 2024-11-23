const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5001; // Use the PORT provided by Heroku or fallback to 5001 for local development

app.use(cors({
  origin: 'https://amharic-app.netlify.app',  // Allow your Netlify URL
  methods: 'GET,POST',                         // Allow the required HTTP methods
  credentials: true
}));
app.use(bodyParser.json());

app.post('/send-feedback', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Your email address from environment variables
      pass: process.env.EMAIL_PASS,  // Your generated app password from environment variables
    },
  });

  const mailOptions = {
    from: email,
    to: 'gezageta@gmail.com',
    subject: `Feedback from ${name}`,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Feedback sent successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
