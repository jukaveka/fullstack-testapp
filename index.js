require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const Team = require("./models/team")
const app = express()

app.use(express.static("dist"))
app.use(express.json())
app.use(morgan("tiny"))

app.get("/", (request, response) => {
  response.send("<h1> Töttöröö <h1>")
})

app.get("/api/teams", (request, response) => {
  Team
    .find({})
    .then(teams => {
      response.json(teams)
    })
})

app.get("/api/teams/:id", (request, response, next) => {
  Team
    .findById(request.params.id)
    .then(team => {
      if (team) {
        response.json(team)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete("/api/teams/:id", (request, response, next) => {
  Team
    .findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end() 
    })
    .catch(error => next(error))
})

app.post("/api/teams", (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: "content missing" })
  }

  const team = new Team({
    content: body.content,
    canadian: body.canadian || false
  })

  team
    .save()
    .then(savedTeam => {
      response.json(savedTeam)
    })
    .catch(error => next(error))
})

app.put("/api/teams/:id", (request, response, next) => {
  const { content, canadian } = request.body

  Team
    .findById(request.params.id)
    .then(team => {
      if (!team) {
        return response.status(404).end()
      }

      team.content = content
      team.canadian = canadian

      return team.save().then((updatedTeam) => {
        response.json(updatedTeam)
      })
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === "CastError") {
    response.status(400).send({ error: "ID-string has incorrect format" })
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
