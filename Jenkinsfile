pipeline {
    agent any

    environment {
        GIT_REPO = "https://github.com/DevopsProjects05/Devops-CICD-End-to-End.git" // Your GitHub repository
        GIT_BRANCH = "main"                                                      // Replace with the branch name
        TERRAFORM_DIR = "./terraform"                                            // Path to Terraform configuration
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
                withAWS(credentials: 'aws-credentials-id', region: "${AWS_REGION}") { // Use AWS credentials
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

        stage('Fetch EC2 Instance Public IP') {
            steps {
                script {
                    echo "Fetching EC2 Instance Public IP..."
                    def publicIp = sh(script: "cd $TERRAFORM_DIR && terraform output -raw public_ip", returnStdout: true).trim()
                    echo "Public IP: ${publicIp}"

                    echo "Generating Ansible Inventory..."
                    writeFile file: "$INVENTORY_FILE", text: """
                    [web]
                    ${publicIp} ansible_ssh_user=ec2-user ansible_ssh_private_key_file=${PRIVATE_KEY} ansible_ssh_common_args='-o StrictHostKeyChecking=no'
                    """
                }
            }
        }

        stage('Test Ansible Connectivity') {
            steps {
                script {
                    echo "Testing Ansible Connectivity..."
                    sh '''
                    ansible -i $INVENTORY_FILE web -m ping
                    '''
                }
            }
        }

        stage('Run Ansible Playbook') {
            steps {
                script {
                    echo "Running Ansible Playbook..."
                    sh '''
                    ansible-playbook -i $INVENTORY_FILE ./playbook.yml
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
