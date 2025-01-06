resource "aws_instance" "web" {
  ami           = "ami-0fd05997b4dff7aac"                               # Amazon Linux 2 AMI
  instance_type = "t2.micro"

  key_name = "DevOps_Practice"    
  
    root_block_device {
    encrypted = true
  }                                   # Replace with your key pair name

  tags = {
    Name = "Terraform-Managed-Instance"
  }

user_data = <<-EOF
#!/bin/bash
#update the system
sudo yum update -y
#install the docker
sudo yum install docker -y
#start the docker
systemctl start docker
#enable the docker
systemctl enable docker

#install the git
sudo yum install git -y

#pull docker image
docker run --name ecommerce -p 3000:3000 nuthan0530/ecommerce-app

EOF
}
