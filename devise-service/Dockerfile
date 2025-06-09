FROM openjdk:17-jdk-alpine
ARG JAR_FILE=target/devise-service-1.0.0.jar
COPY ${JAR_FILE} devise-service.jar
ENTRYPOINT ["java", "-jar", "/devise-service.jar"]

