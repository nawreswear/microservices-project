# Use official OpenJDK 17 runtime as base image
FROM eclipse-temurin:17-jre

# Set working directory inside the container
WORKDIR /app

# Copy the jar file from your build folder to the container
COPY target/api-gateway-1.0.0.jar /app/api-gateway.jar

# Expose port 8181
EXPOSE 8181

# Run the Spring Boot application, set server port to 8181
ENTRYPOINT ["java", "-jar", "/app/api-gateway.jar", "--server.port=8181"]
