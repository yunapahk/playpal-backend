///////////////////////////////
// DEPENDENCIES
///////////////////////////////
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
});

mongoose.connection
    .on('open', () => console.log('Connected to mongoose. Good job!'))
    .on('close', () => console.log('Disconnected from mongoose... Fix me!'))
    .on('error', (error) => console.log(error));

///////////////////////////////
// MODELS 
///////////////////////////////
const Dog = require('./models/Dog');
const Match = require('./models/Match');
const DogPark = require('./models/DogPark');
const Message = require('./models/Message');
const Review = require('./models/Review');
const User = require('./models/User');
const Location = require('./models/Location');

///////////////////////////////
// ROUTES
///////////////////////////////
const dogRoutes = require('./routes/dogs');
const matchRoutes = require('./routes/matches');
const dogParkRoutes = require('./routes/dogParks');
const messageRoutes = require('./routes/messages');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const locationRoutes = require('./routes/locations');

app.use('/dogs', dogRoutes);
app.use('/matches', matchRoutes);
app.use('/dogparks', dogParkRoutes);
app.use('/messages', messageRoutes);
app.use('/reviews', reviewRoutes);
app.use('/users', userRoutes);
app.use('/locations', locationRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Hi server');
});

///////////////////////////////
// ADDITIONAL ERROR HANDLING
///////////////////////////////
// 404 - Not Found Middleware
app.use((req, res, next) => {
    res.status(404).send('Route not found');
});

// General Error Handling Middleware
app.use((error, req, res, next) => {
    res.status(500).json({ error: error.message });
});


///////////////////////////////
// LISTENER
///////////////////////////////
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
