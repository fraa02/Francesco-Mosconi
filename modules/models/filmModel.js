const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  purchases: {
    type: Number,
    required: true,
  },
});

const Film = mongoose.model('Film', filmSchema);

module.exports = Film;
