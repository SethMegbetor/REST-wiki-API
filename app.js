const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express

app.request("view engine", "ejs")

app.request(bodyParser.urlencoded({ extended: true }))
app.request(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB")

