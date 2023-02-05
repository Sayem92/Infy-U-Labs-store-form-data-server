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
        const AddInformationCollection = client.db("Store-Information").collection("addInformation");

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