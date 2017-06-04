var express = require("express");
var router = express.Router();
// Requiring models
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");




// Routes
// ======


// GET scraped data from NY Times
router.get("/scrape", function(req, res) { 
  request("https://www.nytimes.com/pages/politics/index.html", function(error, response, html) { 

    var $ = cheerio.load(html); 

    $(".aColumn .story").each(function(i, element) {

      var result = {};

      result.title = $(this).find('h3').find("a").text().replace("\n", "");
      result.summary = $(this).find('.summary').text();
      result.link = $(this).find('h3').find("a").attr("href");
      result.date = $(this).find('.byline').find(".timestamp").attr("data-utc-timestamp");
      result.img = $(this).find('.thumbnail').find('a').find('img').attr('src');

      //use mogoose model instance
      var entry = new Article(result);

      // console.log(entry); 
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});




router.get("/", function(req, res) {
  Article.find({}).sort({'date': -1}).limit(20).exec(function(err, found) {
    // Log any errors if the server encounters one
    if (err) {
      return console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      // res.json(found);
      var articleObject = {
        articles: found
      };      
      res.render("index", articleObject);
    }
  });
});




router.get("/saved", function(req, res) {
  Article.find({'saved': true}).sort({'date': -1}).limit(20).exec(function(err, found) {
    // Log any errors if the server encounters one
    if (err) {
      return console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      // res.json(found);
      var articleObject = {
        articles: found
      };      
      res.render("saved", articleObject);
    }
  });
});




// save article
router.post("/save/:id", function(req, res) { 
  // Use the article id to find and update it's saved status
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    else {
      // Or send the document to the browser
      res.send(doc);
    }
  });
});


// remove saved article
router.post("/unsave/:id", function(req, res) { 
  // Use the article id to find and update it's saved status
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    else {
      // Or send the document to the browser
      res.send(doc);
    }
  });
});



module.exports = router;