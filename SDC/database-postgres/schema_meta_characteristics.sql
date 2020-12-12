\c reviewsDB;

CREATE TABLE meta_characteristics AS
SELECT characteristics.id, characteristics.product_id, characteristics_reviews.review_ID, characteristics.name, characteristics_reviews.value
FROM characteristics
INNER JOIN characteristics_reviews
ON characteristics.id=characteristics_reviews.characteristic_id;

--create index-
create index product_idMetaChar on meta_characteristics(product_id);

/*
SELECT * FROM meta_characteristics LIMIT 10;

*/


/*
CREATE TABLE IF NOT EXISTS meta_characteristics (
id INT NOT NULL,
product_id INT NOT NULL,
review_id INT NOT NULL,
name VARCHAR(50) NOT NULL,
value INT NOT NULL
);


COPY meta_characteristics(id, product_id, review_id, name, value)
FROM '/home/ubuntu/csv/meta_characteristics.csv'
DELIMITER ','
CSV HEADER;

create index product_id_metaChar on meta_characteristics(product_id);
create index char_name on meta_characteristics(name);
*/








