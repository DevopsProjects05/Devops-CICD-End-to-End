pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                echo "Cloning the GitHub repository..."
                git branch: 'main', url: 'https://github.com/DevopsProjects05/Devops-CICD-End-to-End.git'
            }
        }

        stage('AWS Credentials') {
            steps {
                echo "Injecting AWS credentials..."
                withCredentials([aws(accessKeyVariable: 'AWS_ACCESS_KEY_ID', 
                                     credentialsId: 'aws-credentials', 
                                     secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                        echo "AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID"
                        echo "AWS_SECRET_ACCESS_KEY is configured."
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running npm tests in the 'src' directory..."
                dir('src') {
                    sh '''
                        npm install
                        npm test
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                dir('src') {
                    sh '''
                        docker build -t sample-ecommerce/ecommerce-nodejs:v1 .
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    echo "Pushing Docker image to Docker Hub..."
                    // Log in to Docker Hub using credentials
                    withCredentials([usernamePassword(credentialsId: 'docker-credentials', 
                                                      usernameVariable: 'DOCKER_HUB_USERNAME', 
                                                      passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
                        sh '''
                            echo $DOCKER_HUB_PASSWORD | docker login -u $DOCKER_HUB_USERNAME --password-stdin
                            docker tag sample-ecommerce/ecommerce-nodejs:v1 $DOCKER_HUB_USERNAME/ecommerce-nodejs:v1
                            docker push $DOCKER_HUB_USERNAME/ecommerce-nodejs:v1
                        '''
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo "Running SonarQube analysis..."
                dir('src') {
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            /opt/sonar-scanner/bin/sonar-scanner \
                            -Dsonar.projectKey=SampleECommersProject \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://43.204.230.200:9000/ \
                            -Dsonar.login=sqa_73312e1aa086fede792df907dc29e258ddb00f57

                        '''
                    }
                }
            }
        }

        stage('Terraform Init and Apply') {
            steps {
                echo "Running Terraform commands in the 'Terraform' directory..."
                dir('terraform') {
                    sh '''
                        terraform init
                        terraform validate
                        terraform fmt
                        terraform plan
                        terraform apply -auto-approve
                    '''
                }
            }
        }
    }

    
}
