CREATE TABLE IF NOT EXISTS Posts (
	post_id SERIAL PRIMARY KEY,
	title VARCHAR(250) NOT NULL,
    article VARCHAR(3000) NOT NULL, 
    post_date DATE NOT NULL, 
    post_img 
	
	user_id INT NOT NULL REFERENCES Users
);