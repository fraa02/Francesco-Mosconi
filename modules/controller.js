exports.controller = (app, client, database) => {

    const authController = require("./controller/AuthController");
    const userController = require("./controller/UserController");

    authController.AuthController(app, client, database);
    userController.UserController(app, client, database);

};