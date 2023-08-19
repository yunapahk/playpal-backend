const express = require('express');
const router = express.Router();
const DogPark = require('../models/DogPark'); 

// INDEX - GET - /dogparks - retrieve all dog parks
router.get("/", async (req, res) => {
    try {
        res.json(await DogPark.find({}));
    } catch (error) {
        res.status(400).json({ message: "Error fetching dog parks.", error });
    }
});

// SHOW - GET - /dogparks/:id - get a single dog park
router.get("/:id", async (req, res) => {
    try {
        const dogPark = await DogPark.findById(req.params.id);
        if (!dogPark) {
            return res.status(404).json({ message: "Dog park not found." });
        }
        res.json(dogPark);
    } catch (error) {
        res.status(400).json({ message: "Error fetching the dog park.", error });
    }
});

// CREATE - POST - /dogparks - create a new dog park
router.post("/", async (req, res) => {
    try {
        res.json(await DogPark.create(req.body));
    } catch (error) {
        res.status(400).json({ message: "Error creating dog park.", error });
    }
});

// UPDATE - PUT - /dogparks/:id - update a single dog park
router.put("/:id", async (req, res) => {
    try {
        const updatedPark = await DogPark.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPark) {
            return res.status(404).json({ message: "Dog park not found." });
        }
        res.json(updatedPark);
    } catch (error) {
        res.status(400).json({ message: "Error updating the dog park.", error });
    }
});

// DELETE - DELETE - /dogparks/:id - delete a single dog park
router.delete("/:id", async (req, res) => {
    try {
        const deletedPark = await DogPark.findByIdAndRemove(req.params.id);
        if (!deletedPark) {
            return res.status(404).json({ message: "Dog park not found." });
        }
        res.json(deletedPark);
    } catch (error) {
        res.status(400).json({ message: "Error deleting the dog park.", error });
    }
});

module.exports = router;
