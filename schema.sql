CREATE TABLE IF NOT EXISTS wine
(
    id INTEGER AUTO_INCREMENT NOT NULL,
    producer VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    year VARCHAR(10),
    price VARCHAR(10),
    qty VARCHAR(5),
    bin VARCHAR(100),
    ready VARCHAR(50),
    rating VARCHAR(25),
    PRIMARY KEY (id)
);
