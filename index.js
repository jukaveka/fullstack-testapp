const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny'))

let teams = [
  {
    "id": "1",
    "content": "Winnipeg Jets",
    "canadian": true
  },
  {
    "id": "2",
    "content": "Columbus Blue Jackets",
    "canadian": false
  },
  {
    "id": "3",
    "content": "Montreal Canadiens",
    "canadian": true
  }
]

app.get('/', (request, response) => {
  response.send('<h1> Töttöröö <h1>')
})

app.get('/api/teams', (request, response) => {
  response.json(teams)
})

app.get('/api/teams/:id', (request, response) => {
  const id = request.params.id
  const team = teams.find(team => team.id === id)

  if (team) {
    response.json(team)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/teams/:id', (request, response) => {
  const id = request.params.id
  teams = teams.filter(team => team.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = teams.length > 0
    ? Math.max(...teams.map(n => Number(n.id)))
    : 0

  return String(maxId + 1)
}

app.post('/api/teams', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json(
      { error: 'content missing' }
    )
  }

  const team = {
    content: body.content,
    canadian: body.canadian || false,
    id: generateId()
  }

  teams = teams.concat(team)

  response.json(team)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
