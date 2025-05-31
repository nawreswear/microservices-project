# Use official OpenJDK 17 runtime
FROM openjdk:17-jdk-slim

# Set working directory inside container
WORKDIR /app

# Copy the built jar file into the container
COPY target/dispositif-service-1.0.0.jar app.jar

# Expose port 8484
EXPOSE 8484

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
