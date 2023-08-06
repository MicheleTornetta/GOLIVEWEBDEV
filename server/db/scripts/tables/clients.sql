CREATE TABLE IF NOT EXISTS Clients (
	client_id SERIAL PRIMARY KEY,
	first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,  
    company VARCHAR(250) NOT NULL,
    phone VARCHAR(250) NOT NULL,
    street VARCHAR(250) NOT NULL,
    street2 VARCHAR(250),
    city VARCHAR(250) NOT NULL,
    state CHAR(2) NOT NULL,
    zip VARCHAR(250) NOT NULL,
	
	user_id INT NOT NULL REFERENCES Users
);