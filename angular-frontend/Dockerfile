# Stage 1: Build the Angular application
FROM node:18 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers de dépendances pour maximiser le cache Docker
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source Angular
COPY . .

# Résoudre les problèmes de compatibilité avec OpenSSL si nécessaire
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build de l'application Angular en mode production
RUN npm run build -- --configuration production

# Stage 2: Serve the application with Nginx
FROM nginx:1.25

# Répertoire de destination des fichiers Angular générés
# Vérifie que le chemin correspond à l'outputPath de angular.json
COPY --from=build /app/dist/* /usr/share/nginx/html

# Copier la configuration personnalisée de Nginx (optionnelle)
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 80
EXPOSE 80

# Lancer Nginx en mode premier plan
CMD ["nginx", "-g", "daemon off;"]
