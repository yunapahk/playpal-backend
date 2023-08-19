const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// INDEX - GET - /reviews - Retrieve all reviews
router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find({}).populate('reviewer reviewed');
        res.json(reviews);
    } catch (error) {
        res.status(400).json({ message: "Error fetching reviews.", error });
    }
});

// CREATE - POST - /reviews - Create a new review
router.post("/", async (req, res) => {
    try {
        const newReview = await Review.create(req.body);
        res.json(newReview);
    } catch (error) {
        res.status(400).json({ message: "Error creating review.", error });
    }
});

// SHOW - GET - /reviews/:id - Retrieve details of a single review
router.get("/:id", async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('reviewer reviewed');
        if (!review) {
            return res.status(404).json({ message: "Review not found." });
        }
        res.json(review);
    } catch (error) {
        res.status(400).json({ message: "Error fetching the review.", error });
    }
});

// UPDATE - PUT - /reviews/:id - Update a review (consider if you want users to be able to modify their reviews after submission)
router.put("/:id", async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('reviewer reviewed');
        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found." });
        }
        res.json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: "Error updating the review.", error });
    }
});

// DELETE - DELETE - /reviews/:id - Delete a review
router.delete("/:id", async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndRemove(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found." });
        }
        res.json({ message: "Review deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: "Error deleting the review.", error });
    }
});

module.exports = router;
