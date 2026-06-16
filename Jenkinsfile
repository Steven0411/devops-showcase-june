pipeline {
    agent any

    environment {
        IMAGE_NAME = "yourdockerhubuser/node-app"
        CONTAINER_NAME = "node-app"
    }

    stages {

        stage('Checkout') {
            steps {
                git 'https://github.com/Steven0411/devops-showcase-june.git'
            }
        }

        stage('Install & Test') {
            steps {
                sh 'npm install'
                sh 'npm test || true'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME:${BUILD_NUMBER} ."
            }
        }

        stage('Push Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push $IMAGE_NAME:${BUILD_NUMBER}
                    '''
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                sh """
                ssh -o StrictHostKeyChecking=no ubuntu@EC2_PUBLIC_IP '
                    cd devops-showcase-june &&
                    docker compose pull &&
                    docker compose up -d
                '
                """
            }
        }
    }
}