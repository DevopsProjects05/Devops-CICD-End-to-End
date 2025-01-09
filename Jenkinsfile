pipeline {
    agent any

    stages {
        // Clone Repository
        stage('Clone Repository') {
            steps {
                echo "Cloning the GitHub repository..."
                git branch: 'main', url: 'https://github.com/DevopsProjects05/Devops-CICD-End-to-End.git'
            }
        }

        // SonarQube Analysis
        stage('SonarQube Analysis') {
            steps {
                echo "Running SonarQube analysis..."
                dir('src') {
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            /opt/sonar-scanner/bin/sonar-scanner \
                            -Dsonar.projectKey=Sample-E-Commerce-Project \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://65.0.45.50:9000/ \
                            -Dsonar.login=sqa_92f6a751f2edcbad2c2c673aa784eec7d677ad44
                        '''
                    }
                }
            }
        }

        // Run Tests
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

        // AWS Credentials Injection
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

        // Build Docker Image
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

        // Push Docker Image
        stage('Push Docker Image') {
            steps {
                script {
                    echo "Pushing Docker image to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', 
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

        // Terraform Init and Apply
        stage('Terraform Init and Apply') {
            steps {
                echo "Running Terraform commands in the 'terraform' directory..."
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

    post {
        always {
            echo "Pipeline execution completed."
            // Send Slack notification
            slackSend(
                channel: '#pipeline-alerts',
                color: currentBuild.result == 'SUCCESS' ? 'good' : 'danger',
                message: "Pipeline '${env.JOB_NAME}' #${env.BUILD_NUMBER} finished with status: ${currentBuild.result}. Check logs for details."
            )
        }
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed. Please check the logs for more details."
        }
    }
}
