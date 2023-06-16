CREATE TABLE IF NOT EXISTS Comments (
    comment_id SERIAL PRIMARY KEY,
    comment VARCHAR(2000) NOT NULL, 
    created_date DATE NOT NULL, 
	
	user_id INT NOT NULL REFERENCES Users,
    post_id INT NOT NULL REFERENCES Posts
);