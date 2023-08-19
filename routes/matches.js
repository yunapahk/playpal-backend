const express = require('express');
const router = express.Router();
const Match = require('../models/Match'); 

// INDEX - GET - /matches - retrieve all matches
router.get("/", async (req, res) => {
    try {
        res.json(await Match.find({}).populate('dogs')); // Populating 'dogs' field to retrieve detailed info
    } catch (error) {
        res.status(400).json({ message: "Error fetching matches.", error });
    }
});

// CREATE - POST - /matches - create a new match
router.post("/", async (req, res) => {
    try {
        res.json(await Match.create(req.body));
    } catch (error) {
        res.status(400).json({ message: "Error creating match.", error });
    }
});

// SHOW - GET - /matches/:id - get a single match
router.get("/:id", async (req, res) => {
    try {
        const match = await Match.findById(req.params.id).populate('dogs'); // Populating 'dogs' field to retrieve detailed info
        if (!match) {
            return res.status(404).json({ message: "Match not found." });
        }
        res.json(match);
    } catch (error) {
        res.status(400).json({ message: "Error fetching the match.", error });
    }
});

// UPDATE - PUT - /matches/:id - update a single match
router.put("/:id", async (req, res) => {
    try {
        const updatedMatch = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('dogs');
        if (!updatedMatch) {
            return res.status(404).json({ message: "Match not found." });
        }
        res.json(updatedMatch);
    } catch (error) {
        res.status(400).json({ message: "Error updating the match.", error });
    }
});

// DELETE - DELETE - /matches/:id - delete a single match
router.delete("/:id", async (req, res) => {
    try {
        const deletedMatch = await Match.findByIdAndRemove(req.params.id);
        if (!deletedMatch) {
            return res.status(404).json({ message: "Match not found." });
        }
        res.json(deletedMatch);
    } catch (error) {
        res.status(400).json({ message: "Error deleting the match.", error });
    }
});

module.exports = router;
