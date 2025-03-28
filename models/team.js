const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI

console.log("Connecting to", url)
mongoose.connect(url)
  .then(result => {
    console.log("Connection to MongoDB established", result.Mongoose)
  })
  .catch((error) => {
    console.log("Connection to MongoDB failed with error", error.message)
  })

const teamSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  canadian: Boolean
})

teamSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Team", teamSchema)