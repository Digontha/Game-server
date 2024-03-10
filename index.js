const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!')
})

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jp082z4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    const userCollection = client.db("Game-Enfiled").collection("users");
    const cartCollection = client.db("Game-Enfiled").collection("carts");
    try {

        // await client.connect();
        // Send a ping to confirm a successful connection

        // This for user
        app.post("/users", async (req, res) => {
            const data = req.body
            const query = { email: data.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(data);
            res.send(result);
        });
        app.get("/users", async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        // This for carts

        app.post("/carts",async(req,res)=>{
            const data = req.body;
            const cursor= {title: data.title}
            const isTitleExit = await cartCollection.findOne(cursor);
            if(isTitleExit){
                return res.send({ message: 'game already exists', insertedId: null })
            }
            const result = await cartCollection.insertOne(data);
            res.send(result);
        })

        app.get("/carts", async (req, res) => {
            const result = await cartCollection.find().toArray();
            res.send(result);
        });


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})