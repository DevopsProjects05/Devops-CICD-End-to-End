pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                echo "Cloning the GitHub repository..."
                // Fetch code from the GitHub repository
                git branch: 'main', url: 'https://github.com/DevopsProjects05/Devops-CICD-End-to-End.git'
            }
        }

        stage('AWS Credentials') {
            steps {
                echo "Injecting AWS credentials..."
                // Inject AWS credentials and use them in subsequent steps
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
                    // Install dependencies
                    sh 'npm install'

                    // Run tests
                    sh 'npm test'
                }
            }
        }

        stage('Terraform Init and Apply') {
            steps {
                echo "Running Terraform commands in the 'Terraform' directory..."
                dir('Terraform') {
                    // Run tfsec and output report
                    sh '''
                        tfsec . > tfsec-report.txt
                        echo "TFSEC security report generated."
                    '''

                    // Execute Terraform commands
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
