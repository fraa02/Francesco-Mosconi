exports.routes = (app, client, database) => {
  
const express = require('express');
const router = express.Router();
const authController = require('./authController');

// Registrazione di un nuovo utente
router.post('/register', authController.register);

// Accesso di un utente
router.post('/login', authController.login);

}