const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true }, // The original long URL
    shortUrl: { type: String, required: true, unique: true }, // The generated short URL
    accessCount: { type: Number, default: 0 }, // Total number of times the short URL was accessed
    referrers: { type: Map, of: Number, default: {} }, // Track referrers (e.g., Google, Facebook, etc.)
    geoLocations: { type: Map, of: Number, default: {} }, // Track geo-location-based access counts
    accessTimestamps: { type: [Date], default: [] }, // Log timestamps of each access
    createdAt: { type: Date, default: Date.now }, // Creation date of the short URL
    updatedAt: { type: Date, default: Date.now }, // Last update date for the document
});

// Middleware to update `updatedAt` before saving changes
urlSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Url', urlSchema);
