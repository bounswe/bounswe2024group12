-- Database creation for tests
CREATE DATABASE IF NOT EXISTS test_chess;

-- Granting privileges tu user1 for tests
GRANT ALL PRIVILEGES ON test_chess.* TO 'user1'@'%';
FLUSH PRIVILEGES;
