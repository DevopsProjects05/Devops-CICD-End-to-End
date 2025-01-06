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
                    echo "AWS credentials injected successfully."
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running npm tests in the 'src' directory..."
                dir('src') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo "Running SonarQube analysis..."
                dir('src') {
                    withSonarQubeEnv('SonarQube') {
                        sh '''
                            /bin/sonar-scanner \
                            -Dsonar.projectKey=Sample-e-commerce-project \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=http://3.111.53.200:9000/ \
                            -Dsonar.login=sqa_b536b89560529ed8db27f8ccd06a59f3ad844619
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
    }
}
