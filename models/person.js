/*
    Mongoose-spesifinen koodi
*/
const mongoose = require('mongoose')


// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
var url = process.env.MONGOLAB_URI

mongoose.connect(url,  { useNewUrlParser: true })



var Schema = mongoose.Schema;
var personSchema = new Schema({
    name: String,
    number: String
})



var Person = mongoose.model('Person', personSchema)

/* personSchema.statics.formatPerson = function(err, persons) {
    return {
      name: persons.name,
      number: persons.number
    };
  } */

module.exports = Person