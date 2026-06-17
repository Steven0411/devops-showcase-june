pipeline {
    agent any

    environment {
        IMAGE_NAME = "ukduw/showcase-node-app"
        CONTAINER_NAME = "showcase-node-app"
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/Steven0411/devops-showcase-june.git'
            }
        }

        stage('Install & Test') {
            steps {
                sh 'npm ci'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME:latest ."
            }
        }

        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $IMAGE_NAME:latest
                    '''
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                sshagent(credentials: ['tech603-thabo-aws-key'])
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@52.31.15.176 '
                        cd devops-showcase-june &&
                        docker compose pull &&
                        docker compose up -d
                    '
                    """
            }
        }
    }
}