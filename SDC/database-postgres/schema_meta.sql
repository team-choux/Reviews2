/*

sudo su postgres
psql -f SDC/database-postgres/schema_meta.sql

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

--index product_id-
create index product_id_meta on meta(product_id);

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

/*
COPY meta(id, product_id, one_star, two_star, three_star, four_star, five_star, recommend_true, recommend_false)
FROM '/home/ubuntu/csv/meta.csv'
DELIMITER ','
CSV HEADER;

create index product_id on meta(product_id);
*/