const mongoose = require('mongoose');

const dogParkSchema = new mongoose.Schema({
    name: String,
  // Define the coordinates of the dog park, which will be used for location-based functionalities.
  coordinates: {
    // Specify the type of GeoJSON geometry, in this case, a 'Point'.
    type: {
        type: String,
        // Ensure that the type is set to 'Point', 
        // which is the only valid value in this enumeration.
        enum: ['Point'],
        // If no type is provided, it will default to 'Point'.
        default: 'Point',
    },
    // The actual coordinates represented as an array of numbers.
    // Generally, it is [longitude, latitude] for GeoJSON.
    coordinates: [Number],
    },
});

module.exports = mongoose.model('DogPark', dogParkSchema);
