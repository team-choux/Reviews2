const pgp = require('pg-promise')();

//Method 1: lines 4-5
var connectionString = 'postgres://postgres:Password1@localhost:5432/reviewsDB';
const db = pgp(connectionString);

// //Method 2: lines 8-18
// const connection = {
//   host: 'localhost',
//   port: 5432,
//   database: 'reviewsDB',
//   user: 'postgres',
//   password: 'Password1',
//   max: 30 // use up to 30 connections

//   // "types" - in case you want to set custom type parsers on the pool level
// };
// const db = pgp(connection);


let getSpecificProductReviews = function (request, response, next) {
  //console.log(request.query);

  //if the request has product_id in the query, carry out db query
  if (request.query.hasOwnProperty('product_id')) {
    let productId = request.query.product_id;

    db.any(`select rating from reviews where product_id=${productId}`)
      .then(function(data) {
        console.log('in .then');
        response.send(data);
      })
      .catch(function(err) {
        console.log('error in getAllTransactions in database index.js file');
        response.send(err);
        return next(err);
      });
  } else {
    //if the request does NOT have product_id in the query...
    response.send('Product ID must be defined');
  }
};


let getSpecificProductMeta = function (request, response, next) {
  if (request.query.hasOwnProperty('product_id')) {
    let productId = request.query.product_id;

    db.any(`select * from meta where product_id=${productId}`)
      .then(function(data) {
        console.log('in .then');
        response.send(data);
      })
      .catch(function(err) {
        console.log('error in getSpecificProductMeta in connectionPostgresQueries.js');
        response.send(err);
        return next(err);
      });
  } else {
    response.send('Product ID must be defined');
  }
};




module.exports = {
  db: db,
  getSpecificProductReviews: getSpecificProductReviews,
  getSpecificProductMeta: getSpecificProductMeta
};