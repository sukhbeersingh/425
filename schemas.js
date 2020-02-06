// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vehiclesSchema= new Schema({
  _id: Number,
  make: String,
  model: String,
  year: Number,
  VIN: String,
  msrp: String,
  photo: String,
  description: String,
  purchase_date: Date,
  purchasers_name: String,
  purchasers_email_address: String,
  price_paid: Number

});

module.exports = vehiclesSchema;