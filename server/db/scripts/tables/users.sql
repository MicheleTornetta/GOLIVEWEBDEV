CREATE TABLE IF NOT EXISTS Users (
	user_id SERIAL PRIMARY KEY,
	username VARCHAR(250) UNIQUE,
	password VARCHAR(250),
	email VARCHAR(250) UNIQUE,
);