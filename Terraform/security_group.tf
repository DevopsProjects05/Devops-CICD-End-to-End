resource "aws_security_group" "allow_ssh" {
  name_prefix = "allow_ssh_"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["25.24.98.32/32"]  # Allows SSH from anywhere (use your IP for better security)
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["12.58.65.25/32"]  # Allows HTTP access to your application
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["23.34.56.21/32"]
  }

  tags = {
    Name = "allow_ssh_and_http"
  }
}
