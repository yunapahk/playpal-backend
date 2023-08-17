///////////////////////////////
// DEPENDENCIES
///////////////////////////////
require('dotenv').config();
const { PORT = 4567, DATABASE_URL } = process.env;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
// const bcrypt = require('bcrypt'); // if you plan to hash passwords
const app = express();

///////////////////////////////
// DATABASE CONNECTION
///////////////////////////////
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => {
    console.log('Connected to mongoose. Good job!');
}).catch(error => {
    console.error('Disconnected to mongoose...Fix me!', error);
})

mongoose.connection
    .on('open', () => console.log('Connected to mongoose. Good job!'))
    .on('close', () => console.log('Disconnected from mongoose... Fix me!'))
    .on('error', (error) => console.log(error));

///////////////////////////////
// MODELS
///////////////////////////////

// User Schema
// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true }, // Username of the user
//     password: { type: String, required: true }, // Hashed password for user authentication
//     email: { type: String, required: true }, // Email address of the user
//     dogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dog' }], // References to dogs owned by the user
// });

// const User = mongoose.model('User', userSchema);

// Dog Schema
const DogSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the dog
    breed: String, // Breed of the dog
    age: Number, // Age of the dog
    image: String, // URL to an image of the dog
    size: { type: String, enum: ['Small', 'Medium', 'Large'] }, // Size of the dog (enums: Small, Medium, Large)
    activityLevel: { type: String, enum: ['Low', 'Medium', 'High'] }, // Activity level of the dog (enums: Low, Medium, High)
});

const Dog = mongoose.model('Dog', DogSchema);

// Match Schema
const MatchSchema = new mongoose.Schema({
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

MatchSchema.index({ location: '2dsphere' }); // Geospatial index for location

const Match = mongoose.model('Match', MatchSchema);

// // Message Schema
// const messageSchema = new mongoose.Schema({
//     match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true }, // Reference to the associated match
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the sender user
//     content: String, // Content of the message
//     timestamp: { type: Date, default: Date.now }, // Timestamp of when the message was sent
// });

// const Message = mongoose.model('Message', messageSchema);

// // Review Schema
// const reviewSchema = new mongoose.Schema({
//     reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user leaving the review
//     reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user being reviewed
//     rating: { type: Number, min: 1, max: 5, required: true }, // Rating given in the review
//     content: String, // Additional comments or feedback in the review
// });

// const Review = mongoose.model('Review', reviewSchema);

// // Location Schema 
// const locationSchema = new mongoose.Schema({
//     name: String, // Name of the location
//     coordinates: {
//         type: {
//             type: String,
//             enum: ['Point'],
//             default: 'Point',
//         },
//         coordinates: [Number], // Latitude and longitude coordinates of the location
//     },
// });

// const Location = mongoose.model('Location', locationSchema);


// // DogPark Schema
// const dogParkSchema = new mongoose.Schema({
//     name: String, // Name of the location
//     coordinates: {
//         type: {
//             type: String,
//             enum: ['Point'],
//             default: 'Point',
//         },
//         coordinates: [Number], // Latitude and longitude coordinates of the location
//     },
// });

// const DogPark = mongoose.model('DogPark', dogParkSchema);

module.exports = {
    Dog,
    Match,
    // Message,
    // Review,
    // DogPark, 
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

///////////////////////////////
// Dog Routes
///////////////////////////////
// INDEX - GET - /dogs - gets all dogs
app.get("/dog", async (req, res) => {
    try {
        res.json(await Dog.find({}));
    } catch (error) {
        res.status(400).json({ error });
    }
});

// CREATE - POST - /dogs - create a new dog
app.post("/dog", async (req, res) => {
    try {
      res.json(await Dog.create(req.body))
    } catch (error) {
        res.status(400).json(error);
    }
});

// SHOW - GET - /dogs/:id - get a single dog
app.get("/dog/:id", async (req, res) => {
    try {
        const dog = await Dog.findById(req.params.id);
        res.json(dog);
    } catch (error) {
        res.status(400).json({ error });
    }
});

// UPDATE - PUT - /dog/:id - update a single dog
app.put("/dog/:id", async (req, res) => {
    try {
        res.json(
            await Dog.findByIdAndUpdate(req.params.id, req.body, { new: true })
        );
    } catch (error) {
        res.status(400).json({ error });
    }
});

// DELETE - delete a single dog
app.delete("/dog/:id", async (req, res) => {
    try {
      // send all dogs
      res.json(await Dog.findByIdAndRemove(req.params.id));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

///////////////////////////////
// Match Routes
///////////////////////////////
// INDEX - GET - /matches - gets all matches
app.get("/match", async (req, res) => {
    try {
        res.json(await Match.find({}).populate('dogs')); // Populating 'dogs' field to retrieve detailed info
    } catch (error) {
        res.status(400).json({ error });
    }
});

// CREATE - POST - /matches - create a new match
app.post("/match", async (req, res) => {
    try {
      res.json(await Match.create(req.body))
    } catch (error) {
        res.status(400).json({ error });
    }
});

// SHOW - GET - /matches/:id - get a single match
app.get("/match/:id", async (req, res) => {
    try {
        const match = await Match.findById(req.params.id).populate('dogs'); // Populating 'dogs' field to retrieve detailed info
        res.json(match);
    } catch (error) {
        res.status(400).json({ error });
    }
});

// UPDATE - PUT - /matches/:id - update a single match
app.put("/match/:id", async (req, res) => {
    try {
        res.json(
            await Match.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('dogs')
        );
    } catch (error) {
        res.status(400).json({ error });
    }
});

// DELETE - DELETE - /matches/:id - delete a single match
app.delete("/match/:id", async (req, res) => {
    try {
      res.json(await Match.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json({ error });
    }
});


// // INDEX - Retrieve all dog parks
// app.get('/dogparks', async (req, res) => {
//     try {
//         res.json(await DogPark.find({}));
//     }
//     catch (error) {
//         res.status(400).json(error);
//     }
// });

// // SHOW - Retrieve a single dog park by ID
// app.get('/dogparks/:id', async (req, res) => {
//     try {
//         res.json(await DogPark.findById(req.params.id));
//     } catch (error) {
//         res.status(400).json(error);
//     }
// });

// // CREATE - Add a new dog park
// app.post('/dogparks', async (req, res) => {
//     try {
//         res.json(await DogPark.create(req.body));
//     } catch (error) {
//         res.status(400).json(error);
//     }
// });

// // UPDATE - Modify an existing dog park by ID
// app.put('/dogparks/:id', async (req, res) => {
//     try {
//         res.json(
//             await DogPark.findByIdAndUpdate(req.params.id, req.body, { new: true })
//         );
//     } catch (error) {
//         res.status(400).json(error);
//     }
// });

// // DELETE - Remove a dog park by ID
// app.delete('/dogparks/:id', async (req, res) => {
//     try {
//         res.json(await DogPark.findByIdAndRemove(req.params.id));
//     } catch (error) {
//         res.status(400).json(error);
//     }
// });


///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))

///////////////////////////////
// ADDITIONAL ERROR HANDLING
////////////////////////////////
app.use((error, req, res, next) => {
    res.status(500).json({ error: error.message });
});
app.use((req, res) => {
    res.status(404).send('Route not found');
});