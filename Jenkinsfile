pipeline {
    agent any

    environment {
        GIT_REPO = "https://github.com/DevopsProjects05/Devops-CICD-End-to-End.git" // Your GitHub repository
        GIT_BRANCH = "main"                                                      // Replace with the branch name
        TERRAFORM_DIR = "./Terraform"                                            // Path to Terraform configuration
        INVENTORY_FILE = "./inventory.ini"                                       // Path to dynamically generated Ansible inventory
        PRIVATE_KEY = "C:/Users/USER/OneDrive/Desktop/Keys/DevOps-Practice.pem"  // Path to private key
        AWS_REGION = "ap-south-1"                                                // AWS region
    }

    stages {
        stage('Clone Git Repository') {
            steps {
                script {
                    echo "Cloning Git repository..."
                    git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
                }
            }
        }

        stage('Terraform Init and Apply') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-credentials']]) { // Use AWS credentials
                    script {
                        echo "Initializing and Applying Terraform..."
                        sh '''
                        cd $TERRAFORM_DIR
                        terraform init
                        terraform apply -auto-approve
                        '''
                    }
                }
            }
        }

        

    post {
        always {
            script {
                echo "Cleaning up resources or sending notifications..."
            }
        }
        success {
            script {
                echo "Pipeline executed successfully!"
            }
        }
        failure {
            script {
                echo "Pipeline failed. Please check the logs."
            }
        }
    }
}

