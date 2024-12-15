const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
console.log("Welcome to")

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handler for invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Invalid JSON:", err.message);
    return res.status(400).json({ success: false, message: "Invalid JSON format" });
  }
  next();
});

// Routes
app.post("/create-user", (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  const { name, email, password } = req.body;
  console.log("Welcome to")

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required (name, email, password).",
    });
  }

  res.status(200).json({
    success: true,
    user: { name, email },
  });
});

app.post("/api/contact", async (req, res) => {
  const { name, contact, email, service, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: `"${name}" <${email}>`,
    to: "rushikeshgbhand@gmail.com",
    subject: "New Contact Us Form Submission",
    text: `Name: ${name}\nContact Number: ${contact}\nEmail: ${email}\nService: ${service}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the GCA Backend API!" });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
