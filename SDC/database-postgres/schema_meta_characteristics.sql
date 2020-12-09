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











