-- Active: 1730273008817@@127.0.0.1@5432@postgres@public
-- create user table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE folders (
    folder_id SERIAL PRIMARY KEY,
    folder_name VARCHAR(100) NOT NULL,
    created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE files (
    file_id SERIAL PRIMARY KEY,
    file_name VARCHAR(100) NOT NULL,
    folder_id INT REFERENCES folders(folder_id) ON DELETE CASCADE,
    uploaded_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    file_size BIGINT, -- Size in bytes
    file_type VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    file_id INT REFERENCES files(file_id) ON DELETE CASCADE,
    folder_id INT REFERENCES folders(folder_id) ON DELETE CASCADE,
    access_level VARCHAR(20) NOT NULL -- e.g., 'read', 'write', 'admin'
);

CREATE INDEX idx_user_id ON permissions(user_id);
CREATE INDEX idx_folder_id ON files(folder_id);
CREATE INDEX idx_uploaded_by ON files(uploaded_by);
