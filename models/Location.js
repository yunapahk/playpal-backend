const mongoose = require('mongoose');

// Define the schema for the Location model.
const locationSchema = new mongoose.Schema({
    // Name of the location.
    // It must be present, has a minimum length of 2 characters, 
    // and any extra spaces at the beginning or end will be removed (trim).
    name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true,
    },

    // Geospatial data for the location.
    // This is crucial for any map-based or location-based functionalities.
    coordinates: {
        // Specify the type of GeoJSON geometry, in this case, a 'Point'.
        type: {
            type: String,
            enum: ['Point'],  // Ensure the value is 'Point' for this GeoJSON.
            default: 'Point', // Default value if none is provided.
            required: true,   // It's mandatory to specify the type.
        },
        coordinates: {
            type: [Number],   // An array of numbers representing the coordinates.
            required: true,   // These coordinates are mandatory.
            validate: {
                // Validation to ensure there are exactly 2 coordinates: 
                // typically latitude and longitude.
                validator: function(v) {
                    return v.length === 2;
                },
                // Custom error message if the validation fails.
                message: props => `Expected 2 coordinates but received ${props.value.length}`
            },
        },
    },

    // The next two fields are optional (commented out).
    // If you decide to use them, you can uncomment them.

    // An optional description of the location to provide more context or details.
    // description: {
    //     type: String,
    //     trim: true,  // Remove any extra spaces from the start and end.
    // },

    // A textual representation of the location's full address.
    // address: {
    //     type: String,
    //     trim: true,  // Remove any extra spaces from the start and end.
    // },

}, { 
    // This option adds 'createdAt' and 'updatedAt' timestamp fields to the schema.
    // 'createdAt' indicates when the entry was first created and 
    // 'updatedAt' indicates the last time it was updated.
    timestamps: true 
});

// Create a geospatial index on the 'coordinates' field.
// This is important for efficiently executing geospatial queries.
locationSchema.index({ coordinates: '2dsphere' });

// Create and export the Location model using the defined locationSchema.
// This model will be used for any database operations related to locations.
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
