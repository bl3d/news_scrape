// news scraper
////////////////////////////////////////////

var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
var port = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
/*app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));*/

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
// mongoose.connect("mongodb://localhost/newsScraper"); //local
mongoose.connect("mongodb://heroku_tnp516b5:3mdchlkpmvhubu7v5iie48diaq@ds163681.mlab.com:63681/heroku_tnp516b5"); //remote
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


//handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//routes
var routes = require("./controllers/mainRoutes.js");

app.use("/", routes);


// Listen on port 3000
app.listen(port, function() {
  // console.log("App running on port 3000!");
  console.log("running...");
});
