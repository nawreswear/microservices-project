# Use official OpenJDK 17 runtime
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built jar file into the container
COPY target/facture-service-1.0.0.jar app.jar

# Expose port 8383
EXPOSE 8383

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
