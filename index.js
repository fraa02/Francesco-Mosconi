const express = require('express');
const cors = require('cors');
const cookieParser=require('cookie-parser');
const app = express();
const {MongoClient}=require("mongodb");
const routes=require("./modules/routes");
const dotenv=require('dotenv')

const uri="mongodb://localhost:27017";
const client=new MongoClient(uri);
const database=client.db("node_api_film");

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next();
  });
app.use(express.urlencoded({extended: true}));
dotenv.config();

routes.routes(app, client, database);

app.listen(6000, () => {
    console.log('il server è avviato sulla porta 6000');
});

