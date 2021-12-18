CREATE DATABASE appjam_db;
use appjam_db;

CREATE TABLE list(
    id VARCHAR(50) PRIMARY KEY, -- 주최자+카테고리 (joohoney0)
    title VARCHAR(50) NOT NULL, 
    content TEXT NOT NULL,
    category INT NOT NULL,
    matching_num INT NOT NULL,
    price INT NOT NULL,
    organizer VARCHAR(50) NOT NULL
);

CREATE TABLE party_member(
    id INT AUTO_INCREMENT PRIMARY KEY,
    room VARCHAR(50) NOT NULL, -- LIST ID  
    member_id varchar(50) NOT NULL -- 멤버 이름 JOIN으로 USER에서 해당 정보 가져오기
);

CREATE TABLE applicant(
    id INT AUTO_INCREMENT PRIMARY KEY,
    room VARCHAR(50) NOT NULL, -- LIST ID  
    member_id varchar(50) NOT NULL -- 멤버 이름 JOIN으로 USER에서 해당 정보 가져오기
);

CREATE TABLE user(
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(50), -- 파티 지원할 때 정보 채우기
    tel VARCHAR(50), 
    account VARCHAR(50),
    img VARCHAR(50)
);