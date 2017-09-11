//boiler plate
const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const app = express();
const Card = require('./models/flipcard.js')
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let url = 'mongodb://localhost:27017/flipcard';
mongoose.connect(url);
const ObjectId = require('mongodb').ObjectID;
app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(bodyParser.urlencoded({
  extended: false
}))


//get for the home page
app.get('/', function(req, res) {
  console.log('root path hit');
  Card.find()
    .then(function(deck) {
      console.log(deck);
      res.render('home', {
        deck: deck
      })
    })
    .catch(function(error) {
      console.log('error ' + JSON.stringify(error));
    })
});

app.get('/card', function(req, res) {
  Card.find()
    .then(function(card) {
      console.log(card);
      res.render('flipcard', {
        card: card
      })
    })
    .catch(function(error) {
      console.log('error ' + JSON.stringify(error));
    })
});
//allows me to add a new card
app.post('/card', function(req, res) {
  let name = req.body.name
  let word = req.body.word
  let answer = req.body.answer
  const flipcard = new Card({
    name: name,
    word: word,
    answer: answer
  });

  flipcard.save().then(function(results) {
      console.log("saved " + results);
      return Card.find()
    })
    .then(function(card) {
      console.log(card);
      res.render('flipcard', {
        card: card
      })
    })
    .catch(function(error, card) {
      console.log('error ' + JSON.stringify(error));
      res.redirect('/')
    })
});
//allows me to get one to update
app.get('/update/:id', function(req, res) {
  let id = req.params.id;
  Card.findOne({
      _id: new ObjectId(id)
    })
    .then(function(update) {
      res.render('update', {
      updatecard: update
      })
    })
    .catch(function(error) {
      console.log('error ' + JSON.stringify(error));
      res.redirect('/')
    })
})

// allows me to update the card I grabbed above
app.post('/update/:id', function(req, res) {
  let id = req.params.id
  let word = req.body.word
  let answer = req.body.answer

  Card.updateOne({
      _id: new ObjectId(id)
    }, {
      word: word,
      answer: answer,
    })

    .then(function() {
      res.redirect('/')
    })
});

//allows me to delete a hobbie on the list
app.post('/delete/:id', function(req, res) {
  let id = req.params.id;
  Card.deleteOne({
      _id: new ObjectId(id)
    })
    .then(function() {
      res.redirect('/')
    })
    .catch(function(error, card) {
      console.log('error ' + JSON.stringify(error));
      res.redirect('/')
    })
});


// where we are listening for js
app.listen(3000, function() {
  console.log('Successfully started express appslication!');
});

process.on('SIGINT', function() {
  console.log("\nshutting down");
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected on app termination');
    process.exit(0);
  });
});
