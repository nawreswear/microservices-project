# Use a lightweight Java 17 base image
FROM eclipse-temurin:17-jdk-alpine

# Set environment variables
ENV TZ=UTC
ENV JAVA_OPTS=""

# Create a directory for the app
WORKDIR /app

# Copy the jar file into the container (assuming the jar is already built)
COPY target/client-service-1.0.0.jar app.jar

# Expose the port the service runs on
EXPOSE 8081

# Run the jar file
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
