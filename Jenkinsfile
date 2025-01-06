pipeline {
    agent any

    environment {
        AWS_REGION    = "ap-south-1"                                       // AWS region
        AMI_ID        = "ami-0fd05997b4dff7aac"                           // Amazon Linux 2 AMI
        INSTANCE_TYPE = "t2.micro"                                        // EC2 instance type
        KEY_NAME      = "DevOps_Practice"                                 // Replace with your key pair name
        USER_DATA     = '''#!/bin/bash
# Log all output to user-data.log
exec > /var/log/user-data.log 2>&1

# Update the system
sudo yum update -y

# Install Docker
sudo yum install docker -y

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Pull the ecommerce application image from Docker Hub
sudo docker pull nuthan0530/ecommerce-app:latest

# Run the Docker container
sudo docker run -d --name ecommerimage -p 3000:3000 nuthan0530/ecommerce-app:latest
'''
    }

    stages {
        stage('Provision EC2 Instance') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials'
                ]]) {
                    script {
                        echo "Creating EC2 instance with user data..."
                        def createInstanceCommand = """
                            aws ec2 run-instances \
                                --region ${AWS_REGION} \
                                --image-id ${AMI_ID} \
                                --count 1 \
                                --instance-type ${INSTANCE_TYPE} \
                                --key-name ${KEY_NAME} \
                                --user-data "${USER_DATA}" \
                                --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=Terraform-Managed-Instance}]'
                        """
                        sh createInstanceCommand
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline completed. Check the AWS console for the instance status."
        }
        success {
            echo "Instance provisioned successfully!"
        }
        failure {
            echo "Failed to provision the instance. Check the logs for errors."
        }
    }
}
