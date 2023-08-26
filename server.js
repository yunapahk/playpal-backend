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
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: {type: String, required: true},
  });
  
const User = mongoose.model("User", UserSchema);

const DogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    image: String,
    size:  { type: String, required: true },
    activityLevel: { type: String, required: true },
    username: String
  });
  
  const  Dog = mongoose.model("Dog", DogSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(
    cors({
      origin: "https://playpal-yunapahk.vercel.app",
      credentials: true,
    })
  );
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.get('/cooketest', (req, res) => {
    res.json(req.cookies);
});
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "You have been logged out" });
});

////////////////////////////////
// Custom Auth Middleware Function
////////////////////////////////
async function authCheck(req, res, next){
    if(req.cookies.token){
      const payload = jwt.verify(req.cookies.token, process.env.SECRET)
      req.payload = payload;
      next();
    } else {
      res.status(400).json({ error: "You are not authorized" });
    }
  }

//////////////////////
//ROUTES
//////////////////////

// Test route
app.get('/', (req, res) => {
    res.json({hello: "server"});
});

// AUTH ROUTES
// SIGNUP ROUTE
app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        const user = await User.create({ username, password: hashedPassword });
        res.json(user);
    } catch (error) {
        console.error(error); 
        res.status(400).json({ error: "Failed to create user" });
    }
});

// LOGIN ROUTE
app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      console.log(user)
      if (!user) {
        throw new Error("No user with that username found");
      }
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) {
        throw new Error("Password does not match");
      }
      const token = jwt.sign({ username: user.username }, process.env.SECRET);
      res.cookie("token", token, {
        // can only be accessed by server requests
        httpOnly: true,
        // path = where the cookie is valid
        path: "/",
        // domain = what domain the cookie is valid ons
        secure: true,
        // sameSite = only send cookie if the request is coming from the same origin
        sameSite: "none", // "strict" | "lax" | "none" (secure must be true)
        // maxAge = how long the cookie is valid for in milliseconds
        maxAge: 3600000, // 1 hour
      });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// INDEX - GET - /dogs - gets all dogs
app.get("/dogs", authCheck, async (req, res) => {
    try {
      // fetch all dogs from the database
      const dogs = await Dog.find({});
      // send JSON of all dogs
      res.json(dogs);
    } catch (error) {
      // send error as JSON
      res.status(400).json({ error });
    }
  });
  
// CREATE - POST - /dogs - create a new dog
app.post("/dogs", authCheck, async (req, res) => {
    try {
      const dog = await Dog.create(req.body);
      personalbar.username = req.payload.username;
      res.json(dog);
    } catch (error) {
      res.status(400).json({ error });
    }
  });
  
  // SHOW - GET - /dogs/:id - get a single dog
  app.get("/dogs/:id", authCheck, async (req, res) => {
    try {
      const dog = await Dog.findById(req.params.id);
      res.json(dog);
    } catch (error) {
      res.status(400).json({ error });
    }
  });
  
  // UPDATE - PUT - /dogs/:id - update a single dog
  app.put("/dogs/:id", authCheck, async (req, res) => {
    try {
      const dog = await 
      Dog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(dog);
    } catch (error) {
      res.status(400).json({ error });
    }
  });
  
  // DELETE - DELETE - /dogs/:id - delete a single dog
  app.delete("/dogs/:id", authCheck, async (req, res) => {
    try {
      const dog = await 
      Dog.findByIdAndDelete(req.params.id);
      res.status(204).json(dog);
    } catch (error) {
      res.status(400).json({ error });
    }
  });
  


//////////////////////
// LISTENER
//////////////////////

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
