# Use official OpenJDK image as base
FROM openjdk:17-jdk-slim

# Set environment variable for the JAR file name
ARG JAR_FILE=target/auth-service-1.0.0.jar

# Copy JAR to the image
COPY ${JAR_FILE} app.jar

# Expose port (same as server.port)
EXPOSE 8085

# Run the JAR file
#ENTRYPOINT ["java", "-jar", "app.jar"]
ENTRYPOINT ["java", "-cp", "app.jar", "com.salesapp.auth.AuthServiceApplication"]