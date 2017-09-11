const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    // TODO change name to be unique
    word: { type: String, required: true},
    answer:{ type: String, required: true},
})

const deckSchema = new mongoose.Schema({
  name: String,
  cards: [cardSchema]
})

const card = mongoose.model('flipcard', cardSchema);

module.exports = card;
