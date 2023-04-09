CREATE TABLE IF NOT EXISTS Comments (
    comment_id SERIAL PRIMARY KEY,
	post_id SERIAL FOREIGN KEY,
	title VARCHAR(250) NOT NULL,
    comment VARCHAR(3000) NOT NULL, 
    username 
    post_date DATE NOT NULL, 
	
	user_id INT NOT NULL REFERENCES Users
);