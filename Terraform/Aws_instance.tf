resource "aws_instance" "web" {
  ami           = "ami-0fd05997b4dff7aac"                               # Amazon Linux 2 AMI
  instance_type = "t2.micro"

  key_name = "DevOps_Practice"                                       # Replace with your key pair name

  tags = {
    Name = "Terraform-Managed-Instance"
  }
user_data = <<EOF

#!/bin/bash
#get sudo permission
sudo su -

# Update the system
yum update -y

# Install Docker
yum install docker -y

# Start and enable Docker service
systemctl start docker
systemctl enable docker

# Pull the ecommerce application image from Docker Hub
docker pull nuthan0530/ecommerce-app:latest

# Run the Docker container
docker run -d --name ecommerimage -p 3000:3000 nuthan0530/ecommerce-app:latest

EOF

}

