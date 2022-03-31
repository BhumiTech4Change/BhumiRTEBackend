/*
 * Feedback Schema model with its helper methods
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FeedbackSchema = new Schema({
  email: {type: String, require: true}, feedbackText: {type: String, require: true}
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
