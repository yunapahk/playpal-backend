const mongoose = require('mongoose');

const DogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    breed: String,
    age: Number,
    // An array of image URLs to represent the dog.
    // The user must provide at least 3 images.
    images: {
        type: [String],  // Define the type as an array of strings.

        // Use a custom validator function to ensure the array has at least 3 images.
        validate: {
            // The validator function takes in the array value 'v' and returns true if the condition is met, else false.
            validator: function(v) {
                return v.length >= 3;  // Ensure there are at least 3 images.
            },

            // If validation fails, this message is displayed.
            message: '{PATH} should have at least 3 images.'
        },

        // The images field is required, and an error message is provided if it's not present.
        required: [true, 'Dog must have at least 3 images.']
    },

    // The size of the dog, which can only take on one of three predefined values.
    size: { type: String, enum: ['Small', 'Medium', 'Large'] },

    // The activity level of the dog, which can also only take on one of three predefined values.
    activityLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
});


module.exports = mongoose.model('Dog', DogSchema);
