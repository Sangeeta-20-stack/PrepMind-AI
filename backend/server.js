const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded profile pics

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/session", require("./routes/session"));
app.use("/api/question", require("./routes/question"));
app.use("/api/ai", require("./routes/ai"));
// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));


// Test route for auth
const auth = require("./middleware/auth");
app.get("/api/check", auth, (req, res) => {
  res.json({ message: "Login OK", user: req.user });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
