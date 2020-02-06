// Data service operations setup

const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

const carSchema = require('./schemas.js');
module.exports = function (connectionString) {
  let Cars;

  return {

    // Connect to the database

    connect: function () {
      return new Promise(function (resolve, reject) {
        console.log('Attempting to connect to the database...');
        mongoose.connect(connectionString, { connectTimeoutMS: 5000, useUnifiedTopology: true });
        
        
        var db = mongoose.connection;
        db.on('error', (error) => {
          console.log('Connection error:', error.message);
          reject(error);
        });
        db.once('open', () => {
          console.log('Connection to the database was successful');
          Cars = db.model("vehicles", carSchema, "vehicles")
          resolve();
        });
      });
    },

    // Car requests

    carGetAll: function () {
      return new Promise(function (resolve, reject) {
        Cars.find()
          .sort({ make: 'asc', model: 'asc', year: 'asc' })
          .exec((error, items) => {
            if (error) {
              return reject(error.message);
            }
            return resolve(items);
          });
      })
    },

    carGetById: function (itemId) {
      return new Promise(function (resolve, reject) {
        Cars.findById(itemId, (error, item) => {
          if (error) {
            return reject(error.message);
          }
          if (item) {
            return resolve(item);
          } else {
            return reject('Not found');
          }
        });
      })
    },

    carAdd: function (newItem) {
      return new Promise(function (resolve, reject) {

        Cars.create(newItem, (error, item) => {
          if (error) {
            return reject(error.message);
          }
          return resolve(item);
        });
      })
    },

    carEdit: function (newItem) {
      return new Promise(function (resolve, reject) {

        Cars.findByIdAndUpdate(newItem._id, newItem, { new: true }, (error, item) => {
          if (error) {
            return reject(error.message);
          }
          if (item) {
            return resolve(item);
          } else {
            return reject('Not found');
          }

        });
      })
    },

    carDelete: function (itemId) {
      return new Promise(function (resolve, reject) {

        Cars.findByIdAndRemove(itemId, (error) => {
          if (error) {
            return reject(error.message);
          }
          return resolve();
        })
      })
    }



  } 

} 
