const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Toys are Loading");
});

const username = process.env.DB_USERNAME;
const pass = process.env.DB_PASS;

const uri = `mongodb+srv://${username}:${pass}@cluster0.g4f1thy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    client.connect();
    const database = client.db("toyFactoryDB");
    const toysCollections = database.collection("toys");

    // get all toys
    app.get("/toys", async (req, res) => {
      const allToys = await toysCollections.find().toArray();

      res.send(allToys);
    });

    // get a single toy
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const toy = await toysCollections.findOne(query);

      res.send(toy);
    });

    app.get("/userToys", async (req, res) => {
      const email = req.query.email;
      const query = { sellerEmail: email };

      const options = {
        // sort returned documents in ascending order by title (A->Z)
        // sort: { title: 1 },
        // Include only the `title` and `imdb` fields in each returned document
        projection: {
          _id: 1,
          toyName: 1,
          picture: 1,
          sellerName: 1,
          price: 1,
          rating: 1,
          category: 1,
        },
      };
      const result = await toysCollections.find(query, options).toArray();
      res.send(result);
    });
    // get sorted ascending order price
    app.get("/toys/sort/asc", async(req, res) => {
      const email = req.query.email
      const query = { sellerEmail: email };
      const options = {
        sort: {
          price: -1
        },
        projection: {
          _id: 1,
          toyName: 1,
          picture: 1,
          sellerName: 1,
          price: 1,
          rating: 1,
          category: 1,
        },
      }
      const result = await toysCollections.find(query,options).toArray();
      res.send(result);
    });
    // get sorted descending order
    app.get("/toys/sort/desc", async(req, res) => {
      const email = req.query.email
      const query = { sellerEmail: email };
      const options = {
        sort: {
          price: 1
        },
        projection: {
          _id: 1,
          toyName: 1,
          picture: 1,
          sellerName: 1,
          price: 1,
          rating: 1,
          category: 1,
        },
      }
      const result = await toysCollections.find(query,options).toArray();
      res.send(result);
    });

    // get toys according to category
    app.get("/toys/category/:category", async (req, res) => {
      const category = req.params.category;
      const query = { category: category };
      const toys = await toysCollections.find(query).toArray();

      res.send(toys);
    });

    // add a toy
    app.post("/addToy", async (req, res) => {
      const toyData = req.body;
      const newToy = {
        toyName: toyData.toyName,
        picture: toyData.picture,
        sellerName: toyData.sellerName,
        sellerEmail: toyData.sellerEmail,
        price: toyData.price,
        rating: toyData.rating,
        availableQuantity: toyData.availableQuantity,
        description: toyData.description,
        category: toyData.category,
      };
      const result = await toysCollections.insertOne(newToy);
      res.send(result);
    });

    // delete a toy
    app.delete("/toy/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollections.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, (req, res) => {
  console.log(`Toy factory listening on port ${port}`);
});
