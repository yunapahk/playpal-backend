// DEPENDENCIES
require('dotenv').config();
const { PORT = 4567, DATABASE_URL } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

// DATABASE CONNECTION
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection
    .on('open', () => console.log('Connected to mongoose. Good job!'))
    .on('close', () => console.log('Disconnected from mongoose... Fix me!'))
    .on('error', (error) => console.log(error));

// MODELS

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Username of the user
    password: { type: String, required: true }, // Hashed password for user authentication
    email: { type: String, required: true }, // Email address of the user
    dogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dog' }], // References to dogs owned by the user
});

const User = mongoose.model('User', userSchema);

// Dog Schema
const dogSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the dog
    breed: String, // Breed of the dog
    age: Number, // Age of the dog
    image: String, // URL to an image of the dog
    size: { type: String, enum: ['Small', 'Medium', 'Large'] }, // Size of the dog (enums: Small, Medium, Large)
    activityLevel: { type: String, enum: ['Low', 'Medium', 'High'] }, // Activity level of the dog (enums: Low, Medium, High)
});

// Match Schema
const matchSchema = new mongoose.Schema({
    dogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dog', required: true }], // References to dogs involved in the match
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }, // Status of the match
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: { type: [Number], required: true }, // Coordinates of the match location
    },
    createdAt: { type: Date, default: Date.now }, // Timestamp of when the match was created
});

matchSchema.index({ location: '2dsphere' }); // Geospatial index for location

const Match = mongoose.model('Match', matchSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true }, // Reference to the associated match
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the sender user
    content: String, // Content of the message
    timestamp: { type: Date, default: Date.now }, // Timestamp of when the message was sent
});

const Message = mongoose.model('Message', messageSchema);

// Review Schema
const reviewSchema = new mongoose.Schema({
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user leaving the review
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user being reviewed
    rating: { type: Number, min: 1, max: 5, required: true }, // Rating given in the review
    content: String, // Additional comments or feedback in the review
});

const Review = mongoose.model('Review', reviewSchema);

// Location Schema
const locationSchema = new mongoose.Schema({
    name: String, // Name of the location
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: [Number], // Latitude and longitude coordinates of the location
    },
});

const Location = mongoose.model('Location', locationSchema);

module.exports = {
    User,
    Match,
    Message,
    Review,
    Location,
};

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

///////////////////////////////
// ROUTES
///////////////////////////////

// Test route
app.get('/', (req, res) => {
    res.send('Hi server');
});

// INDEX
app.get('/dogs', async (req, res) => {
    try {
        // send all users
        res.json(await User.find({}));
    }
    catch (error) {
        //send error
        res.status(400).json(error);
    }
});

// SHOW
app.get('/dogs/:id', async (req, res) => {
    try {
        const dogs = await Dogs.findById(req.params.id);
        res.json(dogs);
    } catch (error) {
        res.status(400).json(error);
    }
});

// CREATE
app.post('/dogs', async (req, res) => {
    try {
        res.json(await Dogs.create(req.body));
    } catch (error) {
        res.status(400).json(error);
    }
});

// UPDATE
app.put('/dogs/:id', async (req, res) => {
    try {
        res.json(
            await Dogs.findbyIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
        res.status(400).json(error);
    }
});

// DELETE
app.delete('/dogs/:id', async (req, res) => {
    try {
        res.json(await Dogs.findByIdAndRemove(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))