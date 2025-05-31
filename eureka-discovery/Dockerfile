# Use official OpenJDK 17 runtime
FROM openjdk:17-jdk-slim

# Set working directory inside container
WORKDIR /app

# Copy the built jar file into the container
COPY target/eureka-discovery-1.0.0.jar app.jar

# Expose port 8761
EXPOSE 8761

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
