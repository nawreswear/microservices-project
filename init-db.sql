-- Création des bases de données pour chaque microservice
CREATE DATABASE IF NOT EXISTS salesapp_clients;
CREATE DATABASE IF NOT EXISTS salesapp_produits;
CREATE DATABASE IF NOT EXISTS salesapp_dispositifs;
CREATE DATABASE IF NOT EXISTS salesapp_factures;
CREATE DATABASE IF NOT EXISTS salesapp_reglements;
CREATE DATABASE IF NOT EXISTS salesapp_auth;

-- Création d'un utilisateur pour les microservices
CREATE USER IF NOT EXISTS 'salesapp_user'@'%' IDENTIFIED BY 'salesapp_password';

-- Attribution des privilèges
GRANT ALL PRIVILEGES ON salesapp_clients.* TO 'salesapp_user'@'%';
GRANT ALL PRIVILEGES ON salesapp_produits.* TO 'salesapp_user'@'%';
GRANT ALL PRIVILEGES ON salesapp_dispositifs.* TO 'salesapp_user'@'%';
GRANT ALL PRIVILEGES ON salesapp_factures.* TO 'salesapp_user'@'%';
GRANT ALL PRIVILEGES ON salesapp_reglements.* TO 'salesapp_user'@'%';
GRANT ALL PRIVILEGES ON salesapp_auth.* TO 'salesapp_user'@'%';

FLUSH PRIVILEGES;

-- Insertion de données de test pour l'authentification
USE salesapp_auth;

-- Insertion d'un utilisateur admin par défaut (mot de passe: admin123)
INSERT INTO users (username, password, email, actif, date_creation) VALUES 
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9tYoHA8t0r5lDMy', 'admin@salesapp.com', true, NOW());

INSERT INTO user_roles (user_id, role) VALUES (1, 'ADMIN');

-- Insertion d'un utilisateur normal (mot de passe: user123)
INSERT INTO users (username, password, email, actif, date_creation) VALUES 
('user', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'user@salesapp.com', true, NOW());

INSERT INTO user_roles (user_id, role) VALUES (2, 'USER');