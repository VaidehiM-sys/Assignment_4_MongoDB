const fs = require('fs');
require("dotenv").config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
//const { Kind } = require('graphql/language');
const { MongoClient } = require("mongodb");

const url = process.env.DB_URL;
const port = process.env.API_SERVER_PORT || 3000;
let db;
let introMessage = "Inventory Management System";
const productDB = [];
const resolvers = {
    Query: {
        introMessage: () => introMessage,
        productList,
    },
    Mutation: {
        setIntroMessage,
        productAdd,
    },
}

function setIntroMessage(_, { message }){
    return (introMessage = message);
}

async function productList() {
    const products = await db.collection("products").find({}).toArray();
    return products;
}

async function getNextSequence(name) {
    const result = await db.collection("counters").findOneAndUpdate(
        { _id: name },
        { $inc: {current: 1}},
        {returnOriginal: false}
    );
    return result.value.current;
}

async function productAdd(_, { product }) {
    product.id = await getNextSequence("products");
    const result = await db.collection("products").insertOne(product);
    const productSave = await db.collection("products").findOne({ _id: result.insertedId });
    return productSave;
}

async function connectToDb() {
    const client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    await client.connect();
    console.log("Connected to MongoDB at URL ", url);
    db = client.db();
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
    resolvers,
});

const app = express();

server.applyMiddleware({ app, path: '/graphql' });

(async function() {
    try {
        await connectToDb();
        app.listen(port, () => {
            console.log(`API server started on port ${port}`);
        });
    } catch(err) {
        console.log("ERROR: ",err);
    }
})();