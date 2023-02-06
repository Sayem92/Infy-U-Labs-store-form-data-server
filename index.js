const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middle ware--
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lhckmem.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const usersCollection = client.db("Store-Information").collection("users");

        const AddInformationCollection = client.db("Store-Information").collection("addInformation");



         //save user data ---------
         app.put('/users', async (req, res) => {
            const user = req.body
            const email = user.email
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });



        //information save---
        app.post('/addInformation', async (req, res) => {
            const addInfo = req.body;
            const result = await AddInformationCollection.insertOne(addInfo);
            res.send(result);
        });

        // get all information ---
        app.get('/allInformation/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const result = await AddInformationCollection.find(query).toArray();
            res.send(result);
        });


        // get task data for data---
        app.get('/updateInfor/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await AddInformationCollection.findOne(query)
            res.send(result);
        });
        

         // update information  ------------------------------
         app.put('/allInformation/:id', async (req, res) => {
            const id = req.params.id;
            const updateInfo = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: updateInfo,
            }
            const result = await AddInformationCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        });


        // delete information---
        app.delete('/allInformation/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await AddInformationCollection.deleteOne(query)
            res.send(result);
        });


        

       

       

       







    }
    catch (err) {
        console.log(err);
    }
}

run().catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('store information server is running')
});

app.listen(port, () => {
    console.log('store information  listening on port', port);

})