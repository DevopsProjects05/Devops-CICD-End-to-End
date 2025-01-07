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

        stage('SonarQube Analysis') {
            steps {
                echo "Running SonarQube analysis..."
                dir('src') {
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            /opt/sonar-scanner/bin/sonar-scanner \
                            -Dsonar.projectKey=SampleECommersProject \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://13.201.76.136:9000/ \
                            -Dsonar.login=sqa_92f6a751f2edcbad2c2c673aa784eec7d677ad44
                        '''
                    }
                }
            }
        }

        stage('Terraform Init and Apply') {
            steps {
                echo "Running Terraform commands in the 'Terraform' directory..."
                dir('Terraform') {
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
        }
        success {
            echo "Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed. Please check the logs for more details."
        }
    }
}
