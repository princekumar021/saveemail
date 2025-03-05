const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Define Schema & Model
const EmailSchema = new mongoose.Schema({ email: String });
const Email = mongoose.model("Email", EmailSchema);

// API Route to Save Email
app.post("/save-email", async (req, res) => {
    try {
        const newEmail = new Email({ email: req.body.email });
        await newEmail.save();
        res.status(201).json({ message: "Email saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error saving email" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
