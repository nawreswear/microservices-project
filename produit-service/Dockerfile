# Use official OpenJDK 17 runtime
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built jar file into the container
COPY target/produit-service-1.0.0.jar app.jar

# Expose port 8082
EXPOSE 8082

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
