// schema and model for scraped articles
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({ 
  title: {
    type: String,
    unique: true,
    required: true
  },
  summary: {
    type: String, 
    required: true
  },
  link: {
    type: String,
    unique: true,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

//
var Article = mongoose.model("Article", ArticleSchema);

//
module.exports = Article;
