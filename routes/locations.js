const express = require('express');
const router = express.Router();
const Location = require('../models/Location'); 

// INDEX - GET - /locations - Retrieve all locations
router.get("/", async (req, res) => {
    try {
        const locations = await Location.find({});
        res.json(locations);
    } catch (error) {
        res.status(400).json({ message: "Error fetching locations.", error });
    }
});

// CREATE - POST - /locations - Create a new location
router.post("/", async (req, res) => {
    try {
        const newLocation = await Location.create(req.body);
        res.json(newLocation);
    } catch (error) {
        res.status(400).json({ message: "Error creating location.", error });
    }
});

// SHOW - GET - /locations/:id - Retrieve details of a single location
router.get("/:id", async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ message: "Location not found." });
        }
        res.json(location);
    } catch (error) {
        res.status(400).json({ message: "Error fetching the location.", error });
    }
});

// UPDATE - PUT - /locations/:id - Update details of a single location
router.put("/:id", async (req, res) => {
    try {
        const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLocation) {
            return res.status(404).json({ message: "Location not found." });
        }
        res.json(updatedLocation);
    } catch (error) {
        res.status(400).json({ message: "Error updating the location.", error });
    }
});

// DELETE - DELETE - /locations/:id - Delete a single location
router.delete("/:id", async (req, res) => {
    try {
        const deletedLocation = await Location.findByIdAndRemove(req.params.id);
        if (!deletedLocation) {
            return res.status(404).json({ message: "Location not found." });
        }
        res.json(deletedLocation);
    } catch (error) {
        res.status(400).json({ message: "Error deleting the location.", error });
    }
});

module.exports = router;
