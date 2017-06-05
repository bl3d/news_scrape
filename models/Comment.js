//schema and model for users to create comments
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create the Comment schema
var CommentSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

// 
var Comment = mongoose.model("Comment", CommentSchema);

// 
module.exports = Comment;
