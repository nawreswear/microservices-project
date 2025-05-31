# Build stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
# Copy project files
COPY pom.xml .
COPY src ./src
# Clean Maven cache and build
RUN rm -rf /root/.m2/repository && mvn clean package -DskipTests --no-transfer-progress

# Run stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/auth-service-1.0.0.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]