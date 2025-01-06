pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                // Fetch code from the GitHub repository
                git branch: 'main', url: 'https://github.com/DevopsProjects05/Devops-CICD-End-to-End.git'
            }
        }

        stage('AWS Credentials') {
            steps {
                // Inject AWS credentials and use them in subsequent steps
                withCredentials([aws(accessKeyVariable: 'AWS_ACCESS_KEY_ID', 
                                     credentialsId: 'aws-credentials', 
                                     secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    echo "Using AWS credentials for deployment..."
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('src') {
                    // Run npm tests in the 'src' directory
                    sh 'npm test'
                }
            }
        }

        stage('Terraform Init and Apply') {
            steps {
                dir('Terraform') {
                    // Execute Terraform commands in the 'Terraform' directory
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
