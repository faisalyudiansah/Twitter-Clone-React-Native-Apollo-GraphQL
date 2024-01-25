const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI_ATLAS

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// async function run() {
//   try {
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } catch(error){
//     console.log(error)
//   }
// }
// run().catch(console.dir);

let db;
async function connect() {
  try {
    const database = client.db('gc01-p3-socialmedia');
    db = database
    return database
  } catch (err) {
    console.log(err)
  }
}

function getDb() {
  return db
}

module.exports = { connect, getDb }