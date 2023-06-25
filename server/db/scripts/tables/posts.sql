CREATE TABLE IF NOT EXISTS Posts (
	post_id SERIAL PRIMARY KEY,
	title VARCHAR(250) NOT NULL,
    file_path VARCHAR(250) NOT NULL,
    created_date DATE NOT NULL,
    
	author_id INT NOT NULL REFERENCES Users
);