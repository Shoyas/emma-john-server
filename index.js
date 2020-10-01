const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

require('dotenv').config();


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0wqac.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.use(bodyParser.json());
app.use(cors());

const port = 5000;

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emmaJohnStore").collection("products");
  const ordersCollection = client.db("emmaJohnStore").collection("orders");

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray((error, documents) => {
            res.send(documents);
        })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((error, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/productByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: { $in: productKeys}})
        .toArray((error, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })



});

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port);