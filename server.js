require('dotenv').config();
const { PORT = 4567, DATABASE_URL } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => {
    console.log('Connected to mongoose. Good job!');
}).catch(error => {
    console.error('Disconnected to mongoose...Fix me!', error);
});

mongoose.connection
    .on('open', () => console.log('Connected to mongoose. Good job!'))
    .on('close', () => console.log('Disconnected from mongoose... Fix me!'))
    .on('error', (error) => console.log(error));

// DogSchema definition
const DogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: String,
    age: Number,
    // An array of image URLs to represent the dog.
    // The user must provide at least 3 images.
    images: {
        type: [String], 
        validate: {
            validator: function(v) {
                return v.length >= 3;
            },
            message: '{PATH} should have at least 3 images.'
        },
        required: [true, 'Dog must have at least 3 images.']
    },
    size: { type: String, required: true },
    activityLevel: { type: String, required: true },
});

// Matching function as a method
DogSchema.methods.getMatchScoreWith = function(otherDog) {
    let points = 100;

    if (this.breed === otherDog.breed) {
        points += 10;
    } else {
        points -= 10;
    }

    if (this.size === otherDog.size) {
        points += 5;
    } else {
        points -= 5;
    }

    if (this.activityLevel === otherDog.activityLevel) {
        points += 5;
    } else {
        points -= 5;
    }

    if (Math.abs(this.age - otherDog.age) < 2) {
        points += 3;
    } else {
        points -= 3;
    }

    return Math.max(points, 0);
};

const Dog = mongoose.model('Dog', DogSchema);

// Routes for Dog
const router = express.Router();

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

app.use('/dogs', router);

// Test route
app.get('/', (req, res) => {
    res.send('Hi server');
});

// Additional error handling
app.use((req, res, next) => {
    res.status(404).send('Route not found');
});

app.use((error, req, res, next) => {
    res.status(500).json({ error: error.message });
});

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
