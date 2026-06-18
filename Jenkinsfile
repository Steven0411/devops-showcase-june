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
            }
        }

        stage('Merge to Main') {
            steps steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-creds',
                        usernameVariable: 'GIT_USER',
                        passwordVariable: 'GIT_TOKEN'
                    )
                ]) {
                    sh '''
                        git remote set-url origin https://${GIT_USER}:${GIT_TOKEN}@github.com/Steven0411/devops-showcase-june.git

                        git fetch origin

                        git checkout main
                        git pull origin main

                        git merge --no-ff origin/rps-game -m "Auto-merge origin/rps-game"

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