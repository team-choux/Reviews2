const pgp = require('pg-promise')();
//zero-dependency module that loads environment variables from a .env file into process.env (tldr; stores configuration in the environment separate from code).
require('dotenv').config();

//Method 1: lines 4-5
//var connectionString = 'postgres://postgres:Password1@localhost:5432/reviewsDB';
var connectionString = `postgres://postgres:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}`;
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

  //if the request does NOT have product_id in the query...
  if (!request.query.hasOwnProperty('product_id')) {
    response.send('Product ID must be defined');
  } else {
    let productId = request.query.product_id;
    let productReview =
        {
          'product': productId,
          'page': 0,
          'count': 5,
          'results': []
        };

    //fields in original reviews table was NOT transformed so I manually transforming it using "AS" in the db query
    db.any(`SELECT id AS review_id, rating, date, summary, body, recommended AS recommend, reviewer_name, response, helpfulness FROM reviews WHERE product_id=${productId} AND reported=false`)
      .then(function(reviews) {

        for (var i = 0; i < reviews.length; i++) {
          reviews[i].photos = [];
          //if there is no response, sends back empty string instead of null
          reviews[i].response = reviews[i].response ? reviews[i].response : '';
          //sends back value in recommend as integer instead of boolean
          reviews[i].recommend = reviews[i].recommend === true ? 1 : 0;
          productReview.results.push(reviews[i]);
        }
        return db.any(`
        SELECT reviews_photos.id, reviews_photos.review_id, reviews_photos.url
        FROM reviews
        INNER JOIN reviews_photos
        ON reviews.id=reviews_photos.review_ID
        WHERE product_id=${productId}`);
      })
      .then((photoUrlsForProductId)=>{
        //if there are no photo urls associated with any url, send
        if (photoUrlsForProductId.length === 0) {
          response.send(productReview);
        } else {

          for (var i = 0; i < productReview.results.length; i++) {
            for (var j = 0; j < photoUrlsForProductId.length; j++) {
              if (productReview.results[i].review_id === photoUrlsForProductId[j].review_id) {
                productReview.results[i].photos.push({
                  'id': photoUrlsForProductId[j].id,
                  'url': photoUrlsForProductId[j].url
                });
              }
            }
          }
          response.send(productReview);
        }
      })
      .catch(function(err) {
        console.log('error in getAllTransactions in database index.js file');
        response.send(err);
        return next(err);
      });
  }
};


let getSpecificProductMeta = function (request, response) {
  if (request.query.hasOwnProperty('product_id')) {
    let productId = request.query.product_id;

    let metaData;

    //NOTE: lines 95-114 are wordy but more efficient than trying to trying to make multiple db queries to the reviews table and using COUNT on each of the different star ratings. The meta table (which I created) has all that information condensed into a single line per product_id.  Queries to the meta table does not return information that is nested hence I am manually doing that here.  This meta table however does mean that for post requests, I will need to update two separate tables.
    db.any(`select * from meta where product_id=${productId}`)
      .then(function(rowFromMeta) {
        metaData = {
          'product_id': rowFromMeta[0].product_id,
          'ratings': {
            '1': rowFromMeta[0].one_star,
            '2': rowFromMeta[0].two_star,
            '3': rowFromMeta[0].three_star,
            '4': rowFromMeta[0].four_star,
            '5': rowFromMeta[0].five_star
          },
          'recommended': {
            '0': rowFromMeta[0].recommend_true,
            '1': rowFromMeta[0].recommend_false
          },
          'characteristics': {
            'Quality': {
              'id': null,
              'value': null
            }
          }
        };

        return db.any(`select * from meta_characteristics where product_id=${productId}`);
      })
      .then((rowsFromMetaChar)=>{
        let characteristics = {};

        for (var i = 0; i < rowsFromMetaChar.length; i++) {
          //due to how the database was created ...CHAR was used instead of VARCHAR (this has been fixed in the schema files for future imports)
          let characteristicName = rowsFromMetaChar[i].name.trim();

          if (characteristics.hasOwnProperty(characteristicName)) {
            characteristics[characteristicName].counter++;
            characteristics[characteristicName].total += rowsFromMetaChar[i].value;
          } else {
            characteristics[characteristicName] = {
              'id': rowsFromMetaChar[i].id,
              'value': null,
              'total': rowsFromMetaChar[i].value,
              'counter': 1
            };
          }
        }

        //this part calculates value which an average of the ratings for each category (total ratings/number ratings per category)
        for (var key in characteristics) {
          characteristics[key].value = characteristics[key].total / characteristics[key].counter;
          delete characteristics[key].total;
          delete characteristics[key].counter;
        }
        metaData.characteristics = characteristics;
        response.send(metaData);
      })
      .catch(function(err) {
        console.log('error in getSpecificProductMeta in connectionPostgresQueries.js');
        response.send(err);
      });
  } else {
    response.send('Product ID must be defined');
  }
};




module.exports = {
  db: db,
  getSpecificProductReviews: getSpecificProductReviews,
  getSpecificProductMeta: getSpecificProductMeta,

};