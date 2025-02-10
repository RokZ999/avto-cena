CREATE SCHEMA IF NOT EXISTS "avto-cena";

CREATE TABLE IF NOT EXISTS "avto-cena".avto_net_records (
    id SERIAL PRIMARY KEY,
    vin TEXT,
    name TEXT,
    price INTEGER NOT NULL,
    contact_person_phone TEXT,
    odometer INT,
    registration_date TEXT,
    url TEXT,
    date_of_insert TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE "avto-cena".dober_avto_records (
    id SERIAL PRIMARY KEY,
    post_id TEXT,
    manufacturer_name TEXT,
    manufacturer_code TEXT,
    manufacturer TEXT,
    model_name TEXT,
    odometer INTEGER,
    registration_date TEXT,
    owners INTEGER,
    price INTEGER NOT NULL,
    special_price INTEGER,
    image_url TEXT,
    dealership_code TEXT,
    dealership_name TEXT,
    dealership_image TEXT,
    dealership_street TEXT,
    contact_person_name TEXT,
    date_of_insert TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name TEXT,
    url TEXT,
    vin TEXT
);


CREATE MATERIALIZED VIEW IF NOT EXISTS "avto-cena".all_cars_materialized_view AS
SELECT 
    vin,
    name,
    price,
    date_of_insert,
    odometer,
    registration_date,
    url
FROM "avto-cena".avto_net_records


UNION ALL

SELECT 
    vin,
    name,
    price,
    date_of_insert,
    odometer,
    registration_date,
    url
FROM "avto-cena".dober_avto_records;



CREATE INDEX idx_all_cars_vin ON "avto-cena".all_cars_materialized_view (vin);