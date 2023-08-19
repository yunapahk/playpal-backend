const express = require('express');
const router = express.Router();
const Dog = require('../models/Dog');

// INDEX - GET - /dogs - gets all dogs
router.get("/", async (req, res) => {
    try {
        res.json(await Dog.find({}));
    } catch (error) {
        res.status(400).json({ message: "Error fetching dogs.", error });
    }
});

// CREATE - POST - /dogs - create a new dog
router.post("/", async (req, res) => {
    try {
        res.json(await Dog.create(req.body));
    } catch (error) {
        res.status(400).json({ message: "Error creating dog.", error });
    }
});

// SHOW - GET - /dogs/:id - get a single dog
router.get("/:id", async (req, res) => {
    try {
        const dog = await Dog.findById(req.params.id);
        if (!dog) {
            return res.status(404).json({ message: "Dog not found." });
        }
        res.json(dog);
    } catch (error) {
        res.status(400).json({ message: "Error fetching the dog.", error });
    }
});

// UPDATE - PUT - /dogs/:id - update a single dog
router.put("/:id", async (req, res) => {
    try {
        const updatedDog = await Dog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDog) {
            return res.status(404).json({ message: "Dog not found." });
        }
        res.json(updatedDog);
    } catch (error) {
        res.status(400).json({ message: "Error updating the dog.", error });
    }
});

// DELETE - DELETE - /dogs/:id - delete a single dog
router.delete("/:id", async (req, res) => {
    try {
        const deletedDog = await Dog.findByIdAndRemove(req.params.id);
        if (!deletedDog) {
            return res.status(404).json({ message: "Dog not found." });
        }
        res.json(deletedDog);
    } catch (error) {
        res.status(400).json({ message: "Error deleting the dog.", error });
    }
});

module.exports = router;
