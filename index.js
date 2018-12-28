const http = require('http')
var dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const middleware = require('./utils/middleware')


const bodyParser = require('body-parser')
const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

app.use(middleware.logger)

//app.use(middleware.error)


const Person = require('./models/person')

const morgan = require('morgan')


// tehtävä 3.8* kesken
// morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
morgan.token('id', function getId (req) {
  return req.id
})
// tehtävä 3.8* kesken





app.use(bodyParser.json())
app.use(morgan('tiny'))





// http-get -request, vastataan response-olion send-metodilla
/*app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
  })
*/



  // Vastaus: json-muotoinen _merkkijono_ 
  // express hoitaa muunnoksen json-muotoon (ei tarvita JSON.stringify)
  app.get('/api/persons', (req, res) => {
    Person
      .find({})
      .then(persons => {
        res.json(persons)      
      })
    
  }) 


// Info page
app.get('/info', (request, response) => {
  let amount = persons.length
  let now = new Date()

  let page = `<div>
      <p>Puhelinluettelossa ${amount} henkilöä</p>
      <p>${now}</p>
  </div>`
  response.send(page)
})
 
// Find person
// poluille parametri käyttämällä kaksoispistesyntaksia :id
  // request-olio kertoo pyynnön tiedot
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if ( person ) {
        // ikä tahansa Javascript-olio on truthy
        response.json(person)
    } else {
        // Id:llä ei löydy muistiinpanoa
        // undefined on falsy eli epätosi
        //end: pyyntöön vastataan ilman dataa
        response.status(404).end()
    }
  })


 /*
   Checks that name does not exist in phone book
  
 nameExists = (newN) => {    
  let found = persons.filter(p => p.name === newN)
  if (found.length > 0) {
    return found[0].id
  } else {
    return null
  } 
}
*/

// Add person
//Tapahtumankäsittelijäfunktio dataan käsiksi viittaamalla request.body.
app.post('/api/persons', (request, response) => {
  const body = request.body
  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  const person = new Person({
    name: body.name || false,
    number: body.number || false,
    id: generateId()
  })
  if (person.name === false) {
    return response.status(400).json({ error: 'Name has to be given' })
  }
  console.log('Number ', body.number)
   if (person.number === false) {
     return response.status(400).json({ error: 'Number has to be given' })
   }

 
 // persons = persons.concat(newPerson)
 // Tallennetaan tietokantaan
 person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id? (Post)' })
    })
})
 const generateId = () => {
  return Math.floor(Math.random(1000)*100000)
} 


// update
app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
    id: body._id
  }
  console.log('PUT Number ', body.number)
  Person
     .findByIdAndUpdate(request.params.id, person, {new: true})
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => {
        console.log(error)
        response.status(400).json({ error: 'malformatted id' })
      })
    })
   //if (person.number === false) {
     //return response.status(400).json({ error: 'Number has to be given' })
   
/* if (nameExists(body.name)!==null) {
      person.update({ number: body.number})
        .then(savedPerson => {
          response.json(savedPerson)
        })
        .catch(error => {
          console.log(error)
          response.status(400).send({ error: 'Update error: malformatted id? (Post)' })
        })
    pois tämä return response.status(400).json({ error: `name ${body.name} already exists` })
  } */




 // Resurssin poistava route
 app.delete('/api/persons/:id', (request, response) => {
   Person
     .findByIdAndRemove(request.params.id)
     .then(result => {
       response.status(240).end()
     })
     .catch(error => {
       response.status(400).send({error: 'malformed name'})
       })
     })



const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})