IF NOT EXISTS (SELECT FROM posts WHERE file_path = '2023/june/ConsumerBehaviorChanging.md') THEN
    INSERT INTO posts (title, file_path, created_date, author_id)
	VALUES ('How Can You Keep Up with Consumer Behavior?', '2023/june/ConsumerBehaviorChanging.md', '2023-06-25 19:52:55.255415', 1);
END IF;

IF NOT EXISTS (SELECT FROM posts WHERE file_path = '2023/july/XSSAttack.md') THEN
    INSERT INTO posts (title, file_path, created_date, author_id)
    VALUES ('What Is An XSS Attack?', '2023/july/XSSAttack.md', '2023-07-02 14:02:32.770638', 2);
END IF;

IF NOT EXISTS (SELECT FROM posts WHERE file_path = '2023/july/Website-Goals.md') THEN
    INSERT INTO posts (title, file_path, created_date, author_id)
    VALUES ('Building a Website with the Right Goals', '2023/july/Website-Goals.md', '2023-07-19 20:32:00.412726', 1);
END IF;

IF NOT EXISTS (SELECT FROM posts WHERE file_path = '2023/july/Interactive-Website.md') THEN
    INSERT INTO posts (title, file_path, created_date, author_id)
    VALUES ('What does it mean to make a website more interactive?', '2023/july/Interactive-Website.md', '2023-07-22 09:49:18.440166', 1);
END IF;

IF NOT EXISTS (SELECT FROM posts WHERE file_path = '2023/july/database-importance.md') THEN
    INSERT INTO posts (title, file_path, created_date, author_id)
    VALUES ('What is the Importance of a Database?', '2023/july/database-importance.md', '2023-07-22 11:43:05.479151', 2);
END IF;

IF NOT EXISTS (SELECT FROM posts WHERE file_path = '2023/july/color-importance.md') THEN
    INSERT INTO posts (title, file_path, created_date, author_id)
    VALUES ('Do Colors Matter in a Website Design?', '2023/july/color-importance.md', "2023-07-23 07:10:26.617006", 1);
END IF;