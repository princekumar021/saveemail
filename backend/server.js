const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS Configuration (Fixed)
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:3000"];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); // Allow only defined origins
        } else {
            callback(new Error("CORS Policy: Not allowed"));
        }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ MongoDB Connection
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

// ✅ Schema & Model
const EmailSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }
});
const Email = mongoose.model("Email", EmailSchema);

// ✅ Health Check Route
app.get("/", (req, res) => {
    res.send("🚀 Server is running successfully!");
});

// ✅ Email Save Route
app.post("/save-email", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const newEmail = new Email({ email });
        await newEmail.save();
        res.status(201).json({ message: "✅ Email saved successfully!" });
    } catch (error) {
        console.error("❌ Error saving email:", error);
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already exists!" });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
