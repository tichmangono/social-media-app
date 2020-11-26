const MongoClient = require("mongodb").MongoClient
const uri = "mongodb+srv://tich:SocialMediaApp123@cluster0.yte62.mongodb.net/SocialMediaApp?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true })
client.connect((err) => {
  const collection = client.db("test").collection("devices")
  // perform actions on the collection object
  client.close()
})
