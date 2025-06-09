# Use official OpenJDK 17 runtime
FROM openjdk:17-jdk-slim

# Set working directory inside container
WORKDIR /app

# Copy the JAR file from the build output
COPY target/reglement-service-1.0.0.jar app.jar

# Expose the service port
EXPOSE 8282

# Start the Java application
ENTRYPOINT ["java", "-jar", "app.jar"]
