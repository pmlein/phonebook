const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
var url = process.env.MONGOLAB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})


let newName = ''
let newNumber = ''

const args = process.argv;
console.log('Pituus', args.length)
if (args.length === 4) {
    process.argv.forEach(function (val, index) {
        if (index === 2) {
            newName = val
            console.log(index + ': ' + val);
        }
        if (index === 3) {
            newNumber = val
        }
        
    });


    const person = new Person({
    name: newName,
    number: newNumber
    })

    console.log('Lisätään henkilö ', newName, ' numero ', newNumber,  ' luetteloon.')
    person
    .save()
    .then(response => {
        console.log('Person saved!')
        mongoose.connection.close()
    })
} else {
    if (args.length === 2) {
        Person
            .find({})
            .then(result => {
                    result.forEach(person => {
                        console.log(person)
                    })
                    
            })
    } else {
        console.log('Tapahtui virhe tai yhteystieoja ei löydy')
        mongoose.connection.close()
    }
    
}