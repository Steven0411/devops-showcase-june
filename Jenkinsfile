pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        IMAGE_NAME = "ukduw/showcase-node-app"
        CONTAINER_NAME = "showcase-node-app"
    }

    stages {
    
        stage('Install & Test') {
            steps {
                sh '''
                cd rps-app
                npm ci
                npm test
                '''
                // removed npm test since there're no tests... throws error
            }
        }

        stage('Merge to Main') {
            when {
                branch 'rps-game/*'
            }
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'git-creds',
                        usernameVariable: 'GIT_USER',
                        passwordVariable: 'GIT_PASS'
                    )
                ]) {
                    sh '''
                        git fetch origin

                        git checkout main
                        git pull origin main

                        git merge --no-ff rps-game -m "Auto-merge rps-game"

                        git push origin main
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                cd rps-app
                docker build -t $IMAGE_NAME:latest .
                '''
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
                sshagent(credentials: ['tech603-thabo-aws-key']) {
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
}