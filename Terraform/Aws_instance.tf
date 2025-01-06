resource "aws_instance" "web" {
  ami           = "ami-0fd05997b4dff7aac"                               # Amazon Linux 2 AMI
  instance_type = "t2.micro"

  key_name = "DevOps_Practice"                                       # Replace with your key pair name

  tags = {
    Name = "Terraform-Managed-Instance"
  }
user_data = <<EOF

#!/bin/bash
sudo su -
sudo yum update -y
sudo yum install -y git

# Clone the GitHub repository
git clone https://github.com/DevopsProjects05/Sample-E-Commerce-Project
cd Sample-E-Commerce-Project/

# Install and start NGINX
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Move the web content to NGINX's web root
sudo mv * /usr/share/nginx/html/

# Test and reload NGINX configuration
sudo nginx -t
sudo systemctl reload nginx
EOF

}

