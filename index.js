const express=require('express');

const cors = require ('cors');
// const jwt=require('jsonwebtoken');
const cookieParser =require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
 require ('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(cookieParser());


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

// -----------new midddle ware---------
 

async function run() {
  try {
   
// ------------- connect md---------------

const serviceCollection =client.db('Hotelmanage').collection('services');
const hotelbookingCollection =client.db('Hotelmanage').collection('bookings');

//-------------- ********* auth related api   ******---------------

    

    app.post('/logout', async (req, res) => {
      const user = req.body;
      console.log('logging out', user);
      res.clearCookie('token', { maxAge: 0 }).send({ success: true })
  })


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
  projection:{Name:1,name:1,Price:1,roomimg:1,roomsize:1,Availability:1},
 }
 const result =await serviceCollection.findOne(query,options)
 res.send(result);
}
)

// ******************* Booking ***********************

app.get('/bookings',async(req,res)=>{
  console.log(req.query.email)


let query ={};
if(req.query?.email){
  query={email:req.query.email}
}
  const result =await hotelbookingCollection.find(query).toArray();
  res.send(result);

})


app.post('/bookings',async(req,res)=>{
  const booking=req.body;
  console.log(booking)
  const result =await hotelbookingCollection.insertOne(booking);
  res.send(result)

});

// ********* Dealete Bookin **************
// ----delete-----
app.delete('/bookings/:id',async(req,res)=>{
  const id =req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await hotelbookingCollection.deleteOne(query);
  res.send(result);
 
 })
//  ***********update hotel booking **********
app.put('/bookings/id',async(req,res)=>{
  const id =req.params.id;
  const filter = { _id: new ObjectId (id)};
  const options={upsert:true};
  const updatebook=req.body;
  const book={
    $set:{
      Name:updatebook.Name,
      date:updatebook.date,
      email:updatebook.email,
      Price:updatebook.Price,
    }
  };
  const result = await hotelbookingCollection.updateOne(filter, book, options);
  res.send(result);
})

    // **********Send a ping to confirm a successful connection***********
    // await client.db("admin").command({ ping: 1 });
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