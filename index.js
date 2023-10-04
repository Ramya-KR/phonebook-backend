const express = require('express')
const logger = require('morgan')
const app = express()

logger.token('content', function (req, res) { return JSON.stringify(req.body)})

app.use(express.json())
app.use(logger(':method :url :status :res[content-length] - :response-time ms :content'))



let persons = [
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

const date = new Date()

app.get('/api/persons',(request,response) => {
    response.json(persons)
})

app.get('/api/info', (request,response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people<br/>
    ${date}
    </p>`)
})

app.get('/api/persons/:id',(request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if(person){
        response.json(person)
    }else {
        response.status(404).send(`${id} doesn\'t exist`)
    }
})

app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons',(request,response) => {
    const id = Math.floor(Math.random()*1000)
    const body = request.body
    console.log(body)
    const p = persons.find(person => person.name == body.name)
    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'name or number is missing' 
        })
      }else if(p !== null && p !== undefined) {
        return response.status(400).json({ 
            error: 'name already exists in phonebook' 
          })
      }
    const person = {
        id: id,
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)
    response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})