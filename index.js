const express =require('express');
require ('dotenv').config()
const cors = require ('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// -----------middle ware---------
app.use(cors({
  origin:[
    'http://localhost:5173'
  ],
  credentials:true,
})
)
/*
 hotel
PpxL2n6fPNYYxOfw 
*/



const uri = "mongodb+srv://hotel:PpxL2n6fPNYYxOfw@cluster0.ovpumir.mongodb.net/?retryWrites=true&w=majority";

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
// -------------service connect---------------

const serviceCollection =client.db('Hotelmanage').collection('services');


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

// -----------------
run().catch(console.dir);
app.get('/',(req,res) =>{
  res.send('Hotel  is runing' )
})
app.listen(port,()=>{
  console.log(`Hotel  server is running  on port${port}n`)
})