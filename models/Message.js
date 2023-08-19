const mongoose = require('mongoose');

// Message Schema
const MessageSchema = new mongoose.Schema({
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true }, // Reference to the associated match
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the sender user
    content: String, // Content of the message
    timestamp: { type: Date, default: Date.now }, // Timestamp of when the message was sent
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
