pipeline {
    agent any
    environment {
        // DockerHub
        DOCKERHUB_USER = 'dipesh767'
        FRONTEND_IMAGE = "dipesh767/tm-frontend"
        BACKEND_IMAGE  = "dipesh767/tm-backend"
        // GitOps
        GITOPS_REPO = "https://github.com/Dipesh-Vishwakarma/ArgoCD-GitOps-projects.git"
        // SonarQube server configured in Jenkins
        SONARQUBE = "SonarQube"
    }
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out TaskMaster source code...'
                //checkout scm
                git branch: 'main',
                url: 'https://github.com/Dipesh-Vishwakarma/TaskMaster.git',
                credentialsId: 'github-pat'
            }
        }
        stage('Set Image Tag') {
            steps {
                script {
                    env.IMAGE_TAG = "v${BUILD_NUMBER}"
                    echo "Image Tag: ${env.IMAGE_TAG}"
                }
            }
        }
        stage('Build') {
            steps {
                echo 'Building TaskMaster project...'
                sh '''
                    echo "Checking project files..."
                    ls -la
                    echo "Build stage completed."
                '''
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScanner'
        
                        sh """
                            echo "Running SonarQube analysis..."
        
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=taskmaster \
                            -Dsonar.projectName=TaskMaster \
                            -Dsonar.sources=.
                        """
                    }
                }
            }
        }
        stage('SonarQube Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        stage('Trivy Filesystem Scan') {
            steps {
                sh '''
                    echo "Running Trivy filesystem scan..."
                    trivy fs \
                    --severity HIGH,CRITICAL \
                    .
                '''
            }
        }
        stage('Build Frontend Image') {
            steps {
                sh '''
                    docker build \
                    -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                    ./frontend
                '''
            }
        }
        stage('Build Backend Image') {
            steps {
                sh '''
                    docker build \
                    -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                    ./backend
                '''
            }
        }
        stage('Trivy Frontend Image') {
            steps {
                sh '''
                    trivy image \
                    --severity HIGH,CRITICAL \
                    ${FRONTEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }
        stage('Trivy Backend Image') {
            steps {
                sh '''
                    trivy image \
                    --severity HIGH,CRITICAL \
                    ${BACKEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }
        stage('Login DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) 
                {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                        -u "$DOCKER_USERNAME" \
                        --password-stdin
                    '''
                }
            }
        }
        stage('Push Frontend') {
            steps {
                sh '''
                    docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }
        stage('Push Backend') {
            steps {
                sh '''
                    docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                '''
            }
        }
        stage('Update GitOps Repository') {
        steps {
            dir('gitops') {
                deleteDir()

                withCredentials([usernamePassword(credentialsId: 'github-pat', usernameVariable: 'GITHUB_USERNAME', passwordVariable: 'GITHUB_TOKEN')])
                {
                    sh '''
                        set -e
                        echo "Cloning GitOps repository..."
                        git clone \
                        https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/Dipesh-Vishwakarma/ArgoCD-GitOps-projects.git .

                        git config user.name "${GITHUB_USERNAME}"
                        git config user.email "dipeshaws767@gmail.com"

                        echo "Updating TaskMaster image tags..."

                        sed -i "s#image:.*tm-frontend:.*#image: ${FRONTEND_IMAGE}:${IMAGE_TAG}#" \
                        Projects/TaskMaster/frontend/deployment.yaml

                        sed -i "s#image:.*tm-backend:.*#image: ${BACKEND_IMAGE}:${IMAGE_TAG}#" \
                        Projects/TaskMaster/backend/deployment.yaml

                        echo "Updated manifests:"
                        grep "image:" Projects/TaskMaster/frontend/deployment.yaml
                        grep "image:" Projects/TaskMaster/backend/deployment.yaml

                        git status

                        git add Projects/TaskMaster/frontend/deployment.yaml \
                                Projects/TaskMaster/backend/deployment.yaml

                        git commit \
                        -m "Update TaskMaster images to ${IMAGE_TAG}" || true

                        git push origin main

                        echo "GitOps repository updated successfully."
                    '''
                }
            }
        }
    }
    }
    post {
        success {
            echo '======================================'
            echo 'TaskMaster CI/CD SUCCESS'
            echo '======================================'
            echo "Frontend: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
            echo "Backend : ${BACKEND_IMAGE}:${IMAGE_TAG}"
            echo 'GitOps repository updated.'
            echo 'ArgoCD will deploy the new version.'
        }
        failure {
            echo '======================================'
            echo 'TaskMaster CI/CD FAILED'
            echo '======================================'
            echo 'Check the failed Jenkins stage.'
        }
    }
}