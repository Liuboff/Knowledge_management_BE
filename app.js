const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

//Routes
const categoriesRoutes = require("./routes/categories");
const projectsRoutes = require("./routes/projects");
const tasksRoutes = require("./routes/tasks");
const notesRoutes = require("./routes/notes");
const usersRoutes = require("./routes/users");

const api = process.env.API_URL;

app.use(`${api}/users`, usersRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/notes`, notesRoutes);
app.use(`${api}/projects`, projectsRoutes);
app.use(`${api}/tasks`, tasksRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: "KM_DB",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
