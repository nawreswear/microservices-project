pipeline {
    agent any

    tools {
        jdk 'jdk'          // Your configured JDK name in Jenkins
        // maven 'maven'   // Uncomment if you have Maven configured
        git 'git'          // Your configured Git installation
    }

    environment {
        DOCKER_REGISTRY = "microservices-sales-app"
    }

    stages {
        stage('Clone Repository') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: 'master']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/nawreswear/microservices-project.git',
                        credentialsId: 'github-creds'   // Use your Jenkins Git credentials ID here
                    ]]
                ])
            }
        }

        stage('Build Maven Projects') {
            steps {
                script {
                    def services = [
                        "auth-service",
                        "client-service",
                        "produit-service",
                        "dispositif-service",
                        "facture-service",
                        "reglement-service",
                        "config-service",
                        "eureka-discovery",
                        "api-gateway"
                    ]

                    services.each { service ->
                        dir(service) {
                            sh 'mvn clean package -DskipTests'
                        }
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    def services = [
                        "auth-service",
                        "client-service",
                        "produit-service",
                        "dispositif-service",
                        "facture-service",
                        "reglement-service",
                        "config-service",
                        "eureka-discovery",
                        "api-gateway",
                        "angular-frontend"
                    ]

                    services.each { service ->
                        sh "docker build -t ${DOCKER_REGISTRY}/${service}:latest ./${service}"
                    }
                }
            }
        }

        stage('Start Docker Compose') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}
