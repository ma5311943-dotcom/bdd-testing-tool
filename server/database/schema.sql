-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS fyp;

USE fyp;

-- Create the results table
CREATE TABLE IF NOT EXISTS test_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  availability_status VARCHAR(50),
  response_time INT,
  performance_score INT,
  accessibility_score INT,
  seo_score INT,
  security_https BOOLEAN,
  ai_summary TEXT,
  full_json_result JSON
);
