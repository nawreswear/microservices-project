# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file into the container
COPY target/config-service-1.0.0.jar app.jar

# Expose port 8888
EXPOSE 8888

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
