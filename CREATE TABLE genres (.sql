CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    genre_id INT REFERENCES genres(id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    year_of_birth INT NOT NULL
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) REFERENCES users(username),
    movie_id INT REFERENCES movies(id),
    stars INT CHECK (stars >= 1 AND stars <= 5),
    review_text TEXT
);

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) REFERENCES users(username),
    movie_id INT REFERENCES movies(id)
);
