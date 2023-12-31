const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const routes = require('./modules/routes');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const User = require('./modules/models/userModel');
const Film = require('./modules/models/filmModel');

async function main() {
  await mongoose.connect('mongodb://localhost:27017/node_api_film');

  const newFilm = new Film({
    id: '1',
    title: 'Il tuo titolo',
    language: 'Lingua del film',
    director: 'Nome del regista',
    description: 'Descrizione del film',
    purchases: 0, 
  });

  await newFilm.save();

  const user = new User({ username: '123', password: '12345' });
  user.role = 'admin';
  await user.save();
}

main().catch(err => console.log(err));


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