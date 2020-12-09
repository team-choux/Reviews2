\c reviewsDB;

CREATE TABLE meta_characteristics AS
SELECT characteristics.id, characteristics.product_id, characteristics_reviews.review_ID, characteristics.name, characteristics_reviews.value
FROM characteristics
INNER JOIN characteristics_reviews
ON characteristics.id=characteristics_reviews.characteristic_id;

--create index
create index product_idMetaChar on meta_characteristics(product_id);

/*
SELECT * FROM meta_characteristics LIMIT 10;

*/


CREATE TABLE TESTING4 AS
SELECT reviews.product_id, reviews.id, reviews.rating, reviews.summary, reviews.recommended, reviews.response, reviews.body, reviews.date, reviews.reviewer_name, reviews.helpfulness, reviews_photos.url
FROM reviews
INNER JOIN reviews_photos
ON reviews.id=reviews_photos.review_ID
LIMIT 10;