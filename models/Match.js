const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    dogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dog', required: true }],
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: { type: [Number], required: true },
    },
    createdAt: { type: Date, default: Date.now },
});

MatchSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Match', MatchSchema);
