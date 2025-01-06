resource "aws_instance" "web" {
  ami           = "ami-0fd05997b4dff7aac"                               # Amazon Linux 2 AMI
  instance_type = "t2.micro"

  key_name = "DevOps_Practice"                                       # Replace with your key pair name

  tags = {
    Name = "Terraform-Managed-Instance"
  }

user_data = <<-EOF
#!/bin/bash
#update the system
sudo yum update -y
#insttall the docker
sudo yum install docker -y
#start the docker
sudo service start docker
#enable the docker
sudo service enable docker

#install the git
sudo yum install git -y

EOF

}
