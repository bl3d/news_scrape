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

      var entry = new Article(result);

      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });

    });
  });
  res.send("Scrape Complete"); 
});




router.get("/", function(req, res) {
  Article.find({}).sort({'date': -1}).limit(20).exec(function(err, found) {
    if (err) {
      return console.log(err);
    }
    else {
      var articleObject = {
        articles: found
      };      
      res.render("index", articleObject);
    }
  });
});




router.get("/saved", function(req, res) {
  Article.find({'saved': true}).sort({'date': -1}).limit(20).exec(function(err, found) {
    if (err) {
      return console.log(err);
    }
    else {
      var articleObject = {
        articles: found
      };      
      res.render("saved", articleObject);
    }
  });
});




// save article
router.post("/save/:id", function(req, res) { 
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
  .exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});


// remove saved article
router.post("/unsave/:id", function(req, res) { 
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
  .exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});



//get comments for selected article
router.get("/comments/:id", function(req, res) {
  Article.findOne({ "_id": req.params.id })
  .populate("comments")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      console.log(doc);
      res.json(doc);
    }
  });
});



//save a comment for selected article
router.post("/comments/:id", function(req, res) {  

  var result = {
    title: req.body.title,
    body: req.body.body
  };

  var newComment = new Comment (result); 

  console.log("full obj");
  console.log(newComment);

  newComment.save(function(error, doc) {
    if (error) {
      console.log(error);
    } 
    else { 
      Article.findOneAndUpdate({ "_id": req.params.id }, {$push: { "comments": newComment }}) 
      .exec(function(err, doc) { 
        if (err) {
          console.log(err);
        }
        else { 
          // res.send(doc);
          res.json(newComment);
        }
      });  
    }
  });
});



//delete specific comment for an article
router.post('/uncomment/:id', function (req, res){
  var commentId = req.params.id;
  console.log('should remove: ' + commentId);
  Comment.findByIdAndRemove( { "_id": req.params.id } , function (err, doc) {      
    if (err) {
      console.log(err);
    } 
    else {
      /*Article.findByIdAndRemove( { "_id": req.params.id } , function (err, doc) {      
        if (err) {
          console.log(err);
        } 
        else {
          
          res.send(doc);
        }
      }); */
      res.send(doc);
    }
  });

});






module.exports = router;