const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Toys are Loading");
});

const username = process.env.DB_USERNAME
const pass = process.env.DB_PASS

const uri = `mongodb+srv://${username}:${pass}@cluster0.g4f1thy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("toyFactoryDB");
    const toysCollections = database.collection("toys");

    // get all toys
    app.get("/toys", async (req, res) => {

      const allToys = await toysCollections.find().toArray();
      
      res.send(allToys);

    })

    // get a single toy
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const toy = await toysCollections.findOne(query);

      res.send(toy);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, (req, res) => {
  console.log(`Toy factory listening on port ${port}`);
});
