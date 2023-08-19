//////////////////////
//IMPORT DPEPENDENCIES
//////////////////////
require('dotenv').config();
const { PORT = 4567, DATABASE_URL } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

//////////////////////
//DATABASE CONNECTION
//////////////////////
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection
    .on('open', () => console.log('Connected to mongoose. Good job!'))
    .on('close', () => console.log('Disconnected from mongoose... Fix me!'))
    .on('error', (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const DogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    image: String,
    size:  { type: String, required: true },
    activityLevel: { type: String, required: true }
  });
  
  const  Dog = mongoose.model("Dog", DogSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
  

//////////////////////
//ROUTES
//////////////////////

// Test route
app.get('/', (req, res) => {
    res.json({hello: "server"});
});

// INDEX - GET - /dogs - gets all dogs
app.get("/dogs", async (req, res) => {
    try {
        res.json(await Dog.find({}));
    } catch (error) {
        res.status(400).json({ message: "Error fetching dogs.", error });
    }
});

// CREATE - POST - /dogs - create a new dog
app.post("/dogs", async (req, res) => {
    try {
        res.json(await Dog.create(req.body));
    } catch (error) {
        res.status(400).json({ message: "Error creating dog.", error });
    }
});


// SHOW - GET - /dogs/:id - get a single dog
app.get("/dogs/:id", async (req, res) => {
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
app.put("/dogs/:id", async (req, res) => {
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
app.delete("/dogs/:id", async (req, res) => {
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


//////////////////////
// LISTENER
//////////////////////

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));

