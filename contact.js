const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const serverless = require('serverless-http');

dotenv.config();
const app = express();

// Enable CORS for all origins
app.use(cors({ origin: '*' }));

// Middleware
app.use(bodyParser.json());

// Contact form route
app.post('/contact', async (req, res) => {
  const { name, contact, email, service, message } = req.body;

  // Configure the email transporter
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });

  // Set up email data
  let mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: 'rushikeshgbhand@gmail.com',
    subject: 'New Contact Us Form Submission',
    text: `Name: ${name}\nContact Number: ${contact}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the GCA Backend API!'
  });
});

// Export the serverless handler
module.exports = serverless(app);
