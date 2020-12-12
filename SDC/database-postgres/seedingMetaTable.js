const dbQueries = require('../database-postgres/connectionPostgresQueries');
const db = dbQueries.db;

//function that updates the star ratings in the meta table
let updateMetaStarRatings = function (productIdStart, productIdStop) {

  let starRatingFields = ['one_star', 'two_star', 'three_star', 'four_star', 'five_star'];
  let starRatingFieldValues = [1, 2, 3, 4, 5];

  //outer loop: each of the different star fields in the meta table-
  for (var i = 0; i < starRatingFields.length; i++) {
    let currentStarRatingField = starRatingFields[i];
    let currentStarRatingFieldValue = starRatingFieldValues[i];

    //innder loop: each of the 1,000,011 unique product_ids
    for (var j = productIdStart; j < productIdStop; j++) {

      db.any(`
      UPDATE meta
      SET ${currentStarRatingField} = (
      SELECT
        COUNT(rating)
      FROM
        reviews
      WHERE
        reviews.product_id=${j} AND
        reviews.rating=${currentStarRatingFieldValue}
      )
      WHERE
        meta.product_id=${j};
    `)
        .catch((err)=>{ console.log(err); });
    }
  }
};

//function that updates recommended totals in the meta table
let updateMetaRecommend = function (productIdStart, productIdStop) {

  let recommendFields = ['recommend_true', 'recommend_false'];
  let recommendBoolean = [true, false];

  //outer loop: each of the different star fields in the meta table
  for (var i = 0; i < recommendFields.length; i++) {
    let currentRecommendField = recommendFields[i];
    let currentStarRecommendFieldBoolean = recommendBoolean[i];

    //innder loop: each of the 1,000,011 unique product_ids
    for (var j = productIdStart; j < productIdStop; j++) {

      db.any(`
      UPDATE meta
      SET ${currentRecommendField} = (
      SELECT
        COUNT(recommended)
      FROM
        reviews
      WHERE
        reviews.product_id=${j} AND
        reviews.recommended=${currentStarRecommendFieldBoolean}
      )
      WHERE
        meta.product_id=${j};
    `)
        .catch((err)=>{ console.log(err); });
    }
  }
};

//updateMetaStarRatings(1000000, 1000011);
//updateMetaRecommend(1000000, 1000012);
