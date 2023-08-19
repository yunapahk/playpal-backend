const mongoose = require('mongoose');

// Review Schema
const reviewSchema = new mongoose.Schema({
    reviewer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Reference to the user leaving the review
    reviewed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, // Reference to the user being reviewed
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }, // A numeric rating (e.g., 1-5)
    content: { 
        type: String, 
        required: true,
        trim: true,
        minlength: 1
    }, // Content of the review
}, { 
    timestamps: true // Adds 'createdAt' and 'updatedAt' timestamps automatically
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
