CREATE DATABASE IF NOT EXISTS praktikum_crud;
USE praktikum_crud;

CREATE TABLE IF NOT EXISTS mahasiswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(20) NOT NULL UNIQUE,
    nama VARCHAR(100) NOT NULL,
    jurusan VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    alamat TEXT,
    foto VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, password, full_name)
SELECT 'admin', 'admin@localhost.com', '$2y$10$fJFNjomO9pRcbA9fE9GAzeLvGsqxJqsn8AGaq2JWNzMl2EXjqzrSC', 'Administrator'
WHERE NOT EXISTS (SELECT id FROM users WHERE username = 'admin');
