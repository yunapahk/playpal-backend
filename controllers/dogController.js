// const Dog = require('../models/Dog');

// // INDEX - GET - /dogs - gets all dogs
// const index = async (req, res) => {
//     try {
//         const dogs = await Dog.find({});
//         res.json(dogs);
//     } catch (error) {
//         res.status(400).json({ error });
//     }
// };

// // CREATE - POST - /dogs - create a new dog
// const create = async (req, res) => {
//     try {
//         const dog = await Dog.create(req.body);
//         dog.username = req.payload.username;
//         res.json(dog);
//     } catch (error) {
//         res.status(400).json({ error });
//     }
// };

// // SHOW - GET - /dogs/:id - get a single dog
// const show = async (req, res) => {
//     try {
//         const dog = await Dog.findById(req.params.id);
//         res.json(dog);
//     } catch (error) {
//         res.status(400).json({ error });
//     }
// };

// // UPDATE - PUT - /dogs/:id - update a single dog
// const update = async (req, res) => {
//     try {
//         const dog = await Dog.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(dog);
//     } catch (error) {
//         res.status(400).json({ error });
//     }
// };

// // DELETE - DELETE - /dogs/:id - delete a single dog
// const deleteDog = async (req, res) => {
//     try {
//         const dog = await Dog.findByIdAndDelete(req.params.id);
//         res.status(204).json(dog);
//     } catch (error) {
//         res.status(400).json({ error });
//     }
// };

// const newDog = (req, res) => {
//     // Code for your newDog function.
//     // I noticed you had 'new: newDog' in your exports but didn't provide a function body.
//     // Fill in the body of this function based on what you want to achieve.
// };

// module.exports = {
//   create,
//   newDog,
//   show,
//   index,
//   update,
//   remove: deleteDog,
// };

