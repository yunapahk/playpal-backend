const express = require('express');
const router = express.Router();
const User = require('../models/User');  
// INDEX - GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users.", error });
    }
});

// SHOW - GET a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user.", error });
    }
});

// CREATE - POST a new user
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Error creating user.", error });
    }
});

// UPDATE - PUT to update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating user.", error });
    }
});

// DELETE - DELETE a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user.", error });
    }
});

module.exports = router;
