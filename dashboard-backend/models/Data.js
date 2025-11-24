// dashboard-backend/models/Data.js
const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
  intensity: { type: Number, default: 0 },
  likelihood: { type: Number, default: 0 },
  relevance: { type: Number, default: 0 },
  year: { type: Number }, // Note: 'end_year' is often used in the data as 'year'
  country: { type: String },
  topics: { type: String },
  region: { type: String },
  city: { type: String },
  source: { type: String },
  sector: { type: String },
  pestle: { type: String }, // Renamed from 'PEST' to 'pestle' for accuracy
  // You may add other fields from the JSON file here
}, {
  timestamps: true,
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;