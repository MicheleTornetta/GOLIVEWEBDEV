CREATE TABLE IF NOT EXISTS Posts (
	post_id SERIAL PRIMARY KEY,
	title VARCHAR(250) NOT NULL,
    article TEXT NOT NULL, 
    created_date DATE NOT NULL, 
    	
	user_id INT NOT NULL REFERENCES Users
);