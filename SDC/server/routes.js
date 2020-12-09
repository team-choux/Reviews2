const express = require('express');
/*
https://expressjs.com/en/guide/routing.html
Use the express.Router class to create modular, mountable route handlers.
A Router instance is a complete middleware and routing system;
for this reason, it is often referred to as a “mini-app”.
*/
const router = express.Router();

const dbQueries = require('../database-postgres/connectionPostgresQueries');

router.get('/test', (req, res) => {
  console.log('testing, testing....request was received');
  res.send('testing, testing....request was received');
});


router.get('/reviews/', dbQueries.getSpecificProductReviews);
router.get('/reviews/meta', dbQueries.getSpecificProductMeta);


module.exports = router;