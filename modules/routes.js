exports.routes = (app, client, database) => {
    
    //includo le routes

    const userRoutes=require("./routes/users");
    const booksRoutes=require("./routes/film");

    // inizializzo le routes
    userRoutes.users(app, client, database);
    booksRoutes.film(app, client, database);

}