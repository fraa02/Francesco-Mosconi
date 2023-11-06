exports.routes = (app, client, database) => {
    //includo le routes

    const userRoutes = require("./routes/users");
    const filmRoutes = require("./routes/film");

    // inizializzo le routes
    userRoutes.users(app, client, database);
    filmRoutes.film(app, client, database);
};
