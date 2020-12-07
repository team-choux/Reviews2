/*

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




