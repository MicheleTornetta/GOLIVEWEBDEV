CREATE TABLE IF NOT EXISTS Comments (
    comment_id SERIAL PRIMARY KEY,
	title VARCHAR(250) NOT NULL,
    comment VARCHAR(2000) NOT NULL, 
    post_date DATE NOT NULL, 
	
	user_id INT NOT NULL REFERENCES Users
    --username VARCHAR(250) NOT NULL REFERENCES Users
    --post_id SERIAL NOT NULL REFERENCES Posts
    
);