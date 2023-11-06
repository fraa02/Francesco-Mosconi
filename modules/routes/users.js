const auth = require('../authentication');
const authController = require('../controller/AuthController');
const userController = require('../controller/UserController');

exports.users = (app, client, database) => {
    app.post('/users/login', auth.authentication, async (req, res) => {
    authController.login(req, res, database);
  });

  app.post('/users/register',auth.authentication, async (req, res) => {
    userController.register(req, res, database);
  });

  app.put('/users/refresh', auth.authentication, async (req, res) => {
    userController.refresh(req, res, database);
  });

  app.delete('/users/logout', auth.authentication, async (req, res) => {
    authController.logout(req, res, database);
  });
};