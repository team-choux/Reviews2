/*

sudo su postgres
psql -f SDC/database-postgres/schema.sql

*/

\c reviewsDB;

--create characteristics table (78.3 MB)
CREATE TABLE IF NOT EXISTS characteristics (
id INT NOT NULL PRIMARY KEY,
product_id INT NOT NULL,
name CHAR(50));

/*
--copying csv files over.... COPY 3347478
COPY characteristics(id, product_id, name)
FROM '/home/monica/Documents/HackReactor/Week8/CSVfiles/characteristics.csv'
DELIMITER ','
CSV HEADER;
*/

--create characteristics_reviews table (500.9 MB) --------------------------------------------------
CREATE TABLE IF NOT EXISTS characteristics_reviews (
  id INT NOT NULL PRIMARY KEY,
  characteristic_id INT NOT NULL,
  review_id INT NOT NULL,
  value INT NOT NULL);

/*
--copying csv files over....COPY 19337415
COPY characteristics_reviews(id, characteristic_id, review_id, value)
FROM '/home/monica/Documents/HackReactor/Week8/CSVfiles/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;
*/

--create reviews_photos table (393.6 MB) --------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews_photos (
  id INT NOT NULL PRIMARY KEY,
  review_id INT NOT NULL,
  url varchar(200) NOT NULL);

/*
--copying csv files over....COPY 2742832
COPY reviews_photos(id, review_id, url)
FROM '/home/monica/Documents/HackReactor/Week8/CSVfiles/reviews_photos.csv'
DELIMITER ','
CSV HEADER;
*/

--create reviews table (2.0GB) -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
  id INT NOT NULL PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date DATE NOT NULL,
  summary VARCHAR(1000) NOT NULL,
  body VARCHAR (1000) NOT NULL,
  recommended BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR(60) NOT NULL,
  reviewer_email VARCHAR(100),
  response CHAR(1000),
  helpfulness INT NOT NULL
  );

/*
--copying csv files over....COPY 5777922
COPY reviews(id, product_id, rating, date, summary, body, recommended, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/home/monica/Documents/HackReactor/Week8/CSVfiles/reviews.csv'
DELIMITER ','
CSV HEADER;
*/

--creating index on product_id of reviews table (makes searching for product_id INSANELY FAST)
create index product_id on reviews(product_id);
create index rating on reviews(rating);




