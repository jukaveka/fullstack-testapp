const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Add password to command as argument')
  process.exit(1)
}

process.argv.forEach(arg => {
  console.log(arg)
})

const password = process.argv[2]

const url = `mongodb+srv://juhokavekari:${password}@cluster0.11wdg.mongodb.net/teamApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set(`strictQuery`, false)
mongoose.connect(url)

const teamSchema = new mongoose.Schema({
  content: String,
  canadian: Boolean,
})

const Team = mongoose.model('Team', teamSchema)

Team.find({}).then(result =>{
  console.log(result)

  result.forEach(team => {
    console.log(team)
  })
  mongoose.connection.close()
})

/*const team = new Team({
  content: 'Miami Heat',
  canadian: false,
})

team.save().then(result => {
  console.log('Team saved to database')
  mongoose.connection.close()
})*/
