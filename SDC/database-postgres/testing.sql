/*
*
sudo su postgres
psql -f SDC/database-postgres/organizing_tables.sql

*/

\c reviewsDB;

/*
meta tables has:
product_id          (reviews table or characteristics table)
one_star       (characteristics table tally)
two_star
three_star
four_star
five_star
recommend           (recommend ...need to tally)

*/

CREATE TABLE IF NOT EXISTS meta (
id SERIAL PRIMARY KEY,
product_id INT NOT NULL UNIQUE,
one_star INT,
two_star INT,
three_star INT,
four_star INT,
five_star INT,
recommend_true INT,
recommend_false INT
);

--index product_id
create index product_id_meta on meta(product_id);

/******************************************/
--THIS IS FAST!!!! WOOOOOOOOOOOOO
explain analyze
UPDATE meta
SET one_star = (
SELECT
   COUNT(rating)
FROM
   reviews
WHERE
   reviews.product_id=1 AND
   reviews.rating=1
)
WHERE
   meta.product_id=1;
/******************************************/

--SLOW: this populates the product_id field in the empty meta table with unique product_id from characteristics (otherwise we'd violate the UNIQUE constraint)
UPDATE meta
SET one_star = (
SELECT
   COUNT(rating)
FROM
   reviews
WHERE
   reviews.product_id=meta.product_id AND
   reviews.rating=1
);

--SLOW
UPDATE meta
SET one_star = (
SELECT
   COUNT(rating)
FROM
   reviews
WHERE
   meta.product_id=1 AND
   reviews.product_id=1 AND
   reviews.rating=1
);
--
SELECT id, product_id, rating FROM reviews WHERE product_id=2;
--


/*creates meta_characteristics table*/
CREATE TABLE IF NOT EXISTS meta_characteristics (
id SERIAL PRIMARY KEY,
product_id INT,
review_id INT,
characteristic varchar(20),
value INT
);

/*inserts all of the product_ids and characteristic names from characteristics table into meta_characteristics*/
INSERT INTO meta_characteristics (review_id, value)
   SELECT review_id, value FROM characteristics_reviews
   --WHERE product_id=1;

--updating table with product_ids
UPDATE meta_characteristics
   SET product_id = (
      SELECT DISTINCT product_id FROM reviews
         WHERE id IN (
            SELECT review_id FROM meta_characteristics)
   );


--updating table with characteristics
UPDATE meta_characteristics
   SET characteristic = (
      --select name from characteristics
      --where product_id in meta_characteris matches with product_id in characteristics
      --AND
      SELECT name FROM characteristics WHERE id = (
         SELECT characteristic_id FROM characteristics_reviews
      )



   );

--MUCH BETTER VERSION, CREATES THE TABLES AND POPULATES IT.....
CREATE TABLE meta_characteristics AS
SELECT characteristics.product_id, characteristics_reviews.review_ID, characteristics.name, characteristics_reviews.value
FROM characteristics
INNER JOIN characteristics_reviews
ON characteristics.id=characteristics_reviews.characteristic_id;



--updating table with characteristics
UPDATE meta_characteristics
   SET characteristic = (
   SELECT name FROM characteristics WHERE id IN (
     SELECT characteristic_id FROM characteristics_reviews
     WHERE review_id IN (
      SELECT id FROM reviews
      WHERE product_id=1)
   )
   );






SELECT * FROM characteristics_reviews
WHERE review_id IN (
      SELECT id FROM reviews
      WHERE product_id=1)
   AND characteristic_id IN (
      SELECT id FROM characteristics WHERE product_id=1
);

SELECT * FROM characteristics_reviews
WHERE characteristic_id=(
   SELECT id FROM characteristics WHERE product_id=1
) AND review_id=(SELECT id FROM reviews WHERE product_id=1);

--test: select * from meta_characteristics;


COPY reviews(id, product_id, rating, date, summary, body, recommended, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/home/ubuntu/csv/reviews.csv'
DELIMITER ','
CSV HEADER;