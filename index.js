const http = require('http')

const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())

const morgan = require('morgan')


// tehtävä 3.8* kesken

// morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
morgan.token('id', function getId (req) {
  return req.id
})
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(morgan('tiny'))




// Javascript object
let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-1234567",
      "id": 4
    }
]

// http-get -request, vastataan response-olion send-metodilla
app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
  })

  // Vastaus: json-muotoinen _merkkijono_ 
  // express hoitaa muunnoksen json-muotoon (ei tarvita JSON.stringify)
  app.get('/api/persons', (req, res) => {
    res.json(persons)
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
  */
 nameExists = (newN) => {    
  let found = persons.filter(p => p.name === newN)
  if (found.length > 0) {
    return found[0].id
  } else {
    return null
  } 
}




// Add person
//Tapahtumankäsittelijäfunktio dataan käsiksi viittaamalla request.body.
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const newPerson = {
    name: body.name || false,
    number: body.number || false,
    id: generateId()
  }

  if (newPerson.name === false) {
    return response.status(400).json({ error: 'Name has to be given' })
  }
  console.log('Number ', body.number)
   if (newPerson.number === false) {
     return response.status(400).json({ error: 'Number has to be given' })
   }

  if (nameExists(body.name)!==null) {
    return response.status(400).json({ error: `name ${body.name} already exists` })
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

 const generateId = () => {
  return Math.floor(Math.random(1000)*100000)
} 



 // Resurssin poistava route
 app.delete('/api/persons/:number', (request, response) => {
  const number = request.params.number
  persons = persons.filter(person => person.number !== number)
  // Poisto onnistuu:  204 no content, sillä ei lähetetä dataa
  // epäonnistuessa palautuu sama 204
  response.status(204).end()
})


const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})