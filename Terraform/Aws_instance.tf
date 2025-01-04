resource "aws_instance" "web" {
  ami           = "ami-0fd05997b4dff7aac"                               # Amazon Linux 2 AMI
  instance_type = "t2.micro"

  key_name = "DevOps-Practice"                                       # Replace with your key pair name

  tags = {
    Name = "Terraform-Managed-Instance"
  }
}
