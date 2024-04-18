const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('content', (req, res) => {return JSON.stringify(req.body)})
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :content`))


let people = [
    {
      "id": 1,
      "name": "Arto Hellas",
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

app.get('/api/persons', (request, response) => {
  response.json(people)
})

app.get('/info', (request, response) => {
  const n = people.length
  const datetime = new Date().toString()

  response.send(`<p>Phonebook has info for ${n} people.</p><p>${datetime}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = people.find(person => person.id === id)

  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  people = people.filter(person => person.id !== id)

  response.status(204).end()

})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'Name missing'
    })
  }
  else if (!body.number) {
    return response.status(400).json({
      error: 'Number missing'
    })
  }
  else if (people.find(person => person.name === body.name) !== undefined) {
    return response.status(400).json({
      error: 'Name already in phonebook'
    })
  }

  const generateId = () => {
    return Math.floor(Math.random() * 1000000) + 1
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  people = people.concat(person)

  response.json(people)

})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
