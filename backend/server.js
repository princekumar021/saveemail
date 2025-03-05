const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "*", // Adjust for security in production
    methods: ["GET", "POST"],
    credentials: true
}));

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected Successfully!");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
};
connectDB();

// Define Schema & Model
const EmailSchema = new mongoose.Schema({ email: { type: String, required: true, unique: true } });
const Email = mongoose.model("Email", EmailSchema);

// Health Check Route (Useful for deployment testing)
app.get("/", (req, res) => {
    res.send("🚀 Server is running!");
});

// API Route to Save Email
app.post("/save-email", async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const newEmail = new Email({ email: req.body.email });
        await newEmail.save();
        res.status(201).json({ message: "✅ Email saved successfully!" });
    } catch (error) {
        console.error("❌ Error saving email:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
