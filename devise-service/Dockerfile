
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/devise-service.jar devise-service.jar
ENTRYPOINT ["java","-jar","/devise-service.jar"]
