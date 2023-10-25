const express = require('express');
const cors = require('cors');
const cookieParser=require('cookie-parser');
const app = express();
const {MongoClient}=require("mongodb");
const routes=require("./modules/routes");
const dotenv=require('dotenv')
/*const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password:{type: String, required: true},
  role:{type: String, enum:['user','admin'],default:'user'}
});

const UserModel = mongoose.model('User',userSchema);

async function main(){
  await mongoose.connect('mongodb://localhost:27017');
  const user = new UserModel({username:'123',password:'test'});
  user.role='admin'
  await user.save();
}

main().catch(err=>console.log(err));*/

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

