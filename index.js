const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const routes = require('./modules/routes');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const UserModel = mongoose.model('User', userSchema, 'users');

async function main() {
  await mongoose.connect('mongodb://localhost:27017/node_api_film'); 
  const user = new UserModel({ username: '123', password: '12345' });
  user.role = 'admin';
  await user.save();
}

main().catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});
app.use(express.urlencoded({ extended: true }));
dotenv.config();

routes.routes(app);

app.listen(6000, () => {
  console.log('Il server è avviato sulla porta 6000');
});
