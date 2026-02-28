const mongoose = require("mongoose")

const Key = "mongodb+srv://Databaseman:Petch38@manyhandshop.xec8dhe.mongodb.net/Manyhandshop?retryWrites=true&w=majority"

mongoose.connect(Key)
.then(() => console.log("MongoDB connect"))
.catch(err => console.log(err))

module.exports = mongoose