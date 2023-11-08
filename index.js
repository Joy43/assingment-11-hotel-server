const express =require('express');
// require ('dotenv').config()
const cors = require ('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
// app.use(cors());
app.use(express.json());
/*
 hotel
WoSO9muUeoe2eH12 
*/



const uri = "mongodb+srv://hotel:WoSO9muUeoe2eH12@cluster0.ovpumir.mongodb.net/?retryWrites=true&w=majority";
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
// ------------- connect md---------------

const serviceCollection =client.db('Hotelmanage').collection('services');
const hotelbookingCollection =client.db('Hotelmanage').collection('bookings');



// -----------services---------------


app.get('/services',async(req,res)=>{
  const cursor =serviceCollection.find();
const result =await cursor.toArray();
res.send(result) ; 
})
// -------services data specifig load-----------
app.get('/services/:id',async(req,res)=>{
 const id=req.params.id;
 const query ={_id:new ObjectId(id)} 
 const options={
  projection:{Name:1,Price:1,roomimg:1,roomsize:1,Description:1,Availability:1},
 }
 const result =await serviceCollection.findOne(query,options)
 res.send(result);
}
)

// ******************* Booking ***********************

app.get('/bookings',async(req,res)=>{
  console.log(req.query);
  let query={};
  if(req.query?.email){
query={query:req.query.email}
  }
  const result=await hotelbookingCollection.find().toArray();
  res.send(result)
})


app.post('/bookings',async(req,res)=>{
  const booking=req.body;
  console.log(booking)
  const result =await hotelbookingCollection.insertOne(booking);
  res.send(result)

});

// *********Dealete Bookin**************
// ----delete-----
app.delete('/bookings/:id',async(req,res)=>{
  const id =req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await hotelbookingCollection.deleteOne(query);
  res.send(result);
 
 })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);

// -----------------cheack connect--------
app.get('/',(req,res) =>{
  res.send('Hotel  is runing' )
})
app.listen(port,()=>{
  console.log(`Hotel  server is running  on port${port}`)
})