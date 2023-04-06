const express = require("express");
const mongoose = require("mongoose");
const app = express();
const ejs = require('ejs');
require('dotenv').config({ path: "./vars.env" });

//middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// routes

// connection to mongodb

mongoose.connect('mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@glwd.ije945m.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  });

app.get('/', (req,res) => {
  res.send('working') 
})

app.listen(3000, function() {
    console.log("Database connection successful");
})



app.listen(3000, () => console.log("Server lisening"));
