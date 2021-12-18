CREATE DATABASE appjam_db;
use appjam_db;

CREATE TABLE list(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50) NOT NULL, 
    content TEXT NOT NULL,
    category INT NOT NULL,
    matching_num INT NOT NULL,
    price INT NOT NULL,
    term INT NOT NULL,
    organizer VARCHAR(50) NOT NULL
);
