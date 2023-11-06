exports.controller = (app, client, database) => {

    const authController = require("./controller/AuthController");

    authController.AuthController(app, client, database);

};