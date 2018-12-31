/*
 * Feedback Schema model with its helper methods
*/
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FeedbackSchema = new Schema({
  email:{ type:String, require: true},
  feedback: {type: String, require: true} 
});

module.exports = mongoose.model('Feedback',FeedbackSchema);