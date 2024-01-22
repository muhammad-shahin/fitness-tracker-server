const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.port || 5000;

// middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'UPDATE', 'PUT', 'DELETE'],
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Data Will Add Soon');
});
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ko1sj04.mongodb.net/?retryWrites=true&w=majority`;

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

    const database = client.db('FitnessTrackerDB');
    const trainerCollection = database.collection('trainerCollection');
    const bookingCollection = database.collection('bookingCollection');
    const newsletterCollection = database.collection('newsletterCollection');

    // add newsletter
    app.post('new-letter', async (req, res) => {
      const newsletterInfo = req?.body;
      const result = await newsletterCollection.insertOne(newsletterInfo);
      res.send(result);
    });

    // get all newsletter
    app.get('new-letter', async (req, res) => {
      const cursor = newsletterCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // add new trainer api (Be a trainer)
    app.post('new-trainer', async (req, res) => {
      const trainerInfo = req?.body;
      const result = await trainerCollection.insertOne(trainerInfo);
      res.send(result);
    });

    // get all trainer profile info
    app.get('trainer', async (req, res) => {
      const cursor = trainerCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // trainer slot booking
    app.post('trainer-booking', async (req, res) => {
      const bookingInfo = req?.body;
      const result = await bookingCollection.insertOne(bookingInfo);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.listen(port, () => {
  console.log('Server is Running On Port ', port);
});
