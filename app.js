const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require('body-parser')

const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const backendRoutes = require("./routes/backend/router");
const frontendRoutes = require("./routes/frontend/router");

const sessionRoutes = require('./routes/user');
const pageRoutes = require('./routes/pages');


app.set('view engine', 'ejs');
//app.set('views', __dirname, ' /views');
app.use(express.static('./public'));




mongoose
  .connect(
    "mongodb+srv://LoopYourBox:123Banane@cluster0.cvmy6.gcp.mongodb.net/loopyourbox?retryWrites=true&w=majority",
    { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to database"))
  .catch(() => console.log("Fail to connect to database"));


app.use(express.urlencoded({ extended: false }));

//app.use(express.static("./public"));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(methodOverride("_method"));

app.use('/session', sessionRoutes);
app.use('/', pageRoutes);

//app.use("/api/", backendRoutes);

//app.use("/", frontendRoutes);


module.exports = app;