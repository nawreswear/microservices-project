CREATE DATABASE IF NOT EXISTS salesapp;
CREATE DATABASE IF NOT EXISTS salesapp_user;
CREATE DATABASE IF NOT EXISTS salesapp_clients;
CREATE DATABASE IF NOT EXISTS salesapp_produits;
CREATE DATABASE IF NOT EXISTS salesapp_dispositifs;
CREATE DATABASE IF NOT EXISTS salesapp_factures;
CREATE DATABASE IF NOT EXISTS salesapp_reglements;

CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'root';

GRANT ALL PRIVILEGES ON salesapp.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON salesapp_user.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON salesapp_clients.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON salesapp_produits.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON salesapp_dispositifs.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON salesapp_factures.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON salesapp_reglements.* TO 'root'@'%';

FLUSH PRIVILEGES;
