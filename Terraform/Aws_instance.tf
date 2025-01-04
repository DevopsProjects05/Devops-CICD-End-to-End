resource "aws_instance" "web" {
  ami           = "ami-0c02fb55956c7d316"                               # Amazon Linux 2 AMI
  instance_type = "t2.micro"

  key_name = "DevOps-Practice"                                       # Replace with your key pair name

  tags = {
    Name = "Terraform-Managed-Instance"
  }
}
