# Start from the official Jenkins LTS image
FROM jenkins/jenkins:lts

# Switch to root to install packages
USER root

# Install required dependencies and Docker CLI
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release wget unzip git && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | \
        gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
        https://download.docker.com/linux/debian $(lsb_release -cs) stable" | \
        tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce docker-ce-cli containerd.io && \
    usermod -aG docker jenkins

# (Optional) Install Java 17 - already included in jenkins:lts if using Java 11/17
RUN apt-get install -y openjdk-17-jdk

# Install Maven
ENV MAVEN_VERSION=3.8.5
RUN wget https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.zip && \
    unzip apache-maven-${MAVEN_VERSION}-bin.zip -d /opt && \
    ln -s /opt/apache-maven-${MAVEN_VERSION} /opt/maven && \
    echo 'export MAVEN_HOME=/opt/maven' >> /etc/profile.d/maven.sh && \
    echo 'export PATH=$PATH:/opt/maven/bin' >> /etc/profile.d/maven.sh && \
    chmod +x /opt/maven/bin/mvn && \
    rm apache-maven-${MAVEN_VERSION}-bin.zip

# Set Maven environment variables
ENV MAVEN_HOME=/opt/maven
ENV PATH=$PATH:/opt/maven/bin

# Clean up APT cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Switch back to the Jenkins user
USER jenkins
