CREATE DATABASE IF NOT EXISTS mata_mosquito_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE mata_mosquito_db;

CREATE TABLE IF NOT EXISTS pontuacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL,
    pontos INT NOT NULL DEFAULT 0,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ranking_pontos ON pontuacoes (pontos DESC);