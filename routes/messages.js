const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// INDEX - GET - /messages - Retrieve all messages (consider pagination or limiting in a real-world app)
router.get("/", async (req, res) => {
    try {
        const messages = await Message.find({}).populate('match sender');
        res.json(messages);
    } catch (error) {
        res.status(400).json({ message: "Error fetching messages.", error });
    }
});

// CREATE - POST - /messages - Create a new message
router.post("/", async (req, res) => {
    try {
        const newMessage = await Message.create(req.body);
        res.json(newMessage);
    } catch (error) {
        res.status(400).json({ message: "Error sending message.", error });
    }
});

// SHOW - GET - /messages/:id - Retrieve details of a single message
router.get("/:id", async (req, res) => {
    try {
        const message = await Message.findById(req.params.id).populate('match sender');
        if (!message) {
            return res.status(404).json({ message: "Message not found." });
        }
        res.json(message);
    } catch (error) {
        res.status(400).json({ message: "Error fetching the message.", error });
    }
});

// DELETE - DELETE - /messages/:id - Delete a single message (usually you might want to restrict this or log deletions)
router.delete("/:id", async (req, res) => {
    try {
        const deletedMessage = await Message.findByIdAndRemove(req.params.id);
        if (!deletedMessage) {
            return res.status(404).json({ message: "Message not found." });
        }
        res.json({ message: "Message deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: "Error deleting the message.", error });
    }
});

module.exports = router;
