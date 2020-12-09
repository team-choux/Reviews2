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
    let productReview =
        {
          'product': productId,
          'page': 0,
          'count': 5,
          'results': []
        };

    db.any(`select * from reviews where product_id=${productId}`)
      .then(function(reviews) {

        for (var i = 0; i < reviews.length; i++) {
          if (reviews[i].reported === false) {

            reviews[i].reviewId = reviews[i].id;
            reviews[i].recommend = reviews[i].recommended;
            reviews[i].photos = [];
            delete reviews[i].recommended;
            delete reviews[i].id;
            delete reviews[i].product_id;
            delete reviews[i].reported;
            delete reviews[i].reviewer_email;

            productReview.results.push(reviews[i]);
          }
        }

        response.send(productReview);
      })
      .then(()=>{})
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

    let metaData;


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

          //due to how the database was created ...CHAR was used instead of VARCHAR
          let characteristicName = rowsFromMetaChar[i].name.trim();

          if (characteristics.hasOwnProperty(characteristicName)) {
            characteristics[characteristicName].counter++;
            characteristics[characteristicName] += rowsFromMetaChar[i].value;
          } else {
            characteristics[`"${characteristicName}"`] = {
              'id': rowsFromMetaChar[i].id,
              'value': null,
              'total': rowsFromMetaChar[i].value,
              'counter': 1
            };
          }
        }

        for (var key in characteristics) {
          characteristics[key].value = characteristics[key].total / characteristics[key].counter;
          delete characteristics[key].total;
          delete characteristics[key].counter;
        }


        metaData.characteristics = characteristics;

        response.send(metaData);
        //response.send(characteristics);

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