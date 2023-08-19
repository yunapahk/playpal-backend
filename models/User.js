const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },  // Remember to hash this before saving!
    email: {
        type: String,
        required: true,
        unique: true,
        // Regex validation:
        // This is best for data integrity by reducing the chances of storing invalid emails
        // If a user types an email without the @ symbol, the regex validation can catch it
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please fill a valid email address']  // Basic email regex validation
    },
    dogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dog' }],
    images: {
        type: [String],  // Array of image URLs
        validate: {
            validator: function(v) {
                return v.length >= 1;  // At least 1 image for users
            },
            message: '{PATH} should have at least 1 image.'
        },
        required: [true, 'User must have at least 1 image.']
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
