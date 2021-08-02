const { request, response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

let persons = [
    { 
        "id": 1,
        "name": "Arto de Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/', (request, response) => {
    console.log('get src init');
    response.send('<h1>Hello World!</h1>');
})

app.get('/api/persons', (request, response) => {
    console.log('get persons init');
    response.json(persons)
})

app.get('/info', (request, response) => {
    console.log('get info init');
    phonebook_length = persons.length
    today = new Date
    full_date = (today.toDateString()) + ' ' + (today.toTimeString())
    console.log('date is:', full_date);
    response.send(`The Phonebook currently has ${phonebook_length} entries<br/><br/> 
    ${full_date}`)
})

app.get('/api/persons/:id', (request, response) => {
    console.log('GET single person init');
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).send('<h1>[404] No match found for selected ID</h1>').end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    console.log('DELETE person init');
    const id = Number(request.params.id)
    const new_persons = persons.filter(person => person.id !== id)

    response.json(new_persons)
})

const generateID = () => {
    return Math.floor(Math.random() * 30)
}

app.use(morgan(':method :url :status :response-time :body'))

app.post('/api/persons', (request, response) => {
    const body =request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person_list = persons.find(person => person.name === body.name)
    if (person_list) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateID(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
