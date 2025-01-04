# CI/CD Pipeline Setup: Step-by-Step Guide

This guide will walk you through the process of setting up a CI/CD pipeline from scratch, using tools like Jenkins, Docker, Node.js, Terraform, and Ansible. Whether you're a beginner or experienced, this guide will explain everything from basic setup to containerization and deployment.

---

## Step 1: Create the EC2 Instance

### Objective:
Launch an EC2 instance with the proper configuration for setting up your CI/CD pipeline.

### Why?
An EC2 instance serves as the server where you will install and configure tools like Jenkins, Docker, and Node.js to manage your CI/CD pipeline.

### Actions:
1. **Define Instance Configuration**:
   - **Instance Type**: `t2.medium` (suitable for moderate workloads).
   - **Volume**: Allocate `20-30 GB` to store tools and application data.

2. **Manual Steps (AWS Console)**:
   - Navigate to **AWS Console > EC2 > Launch Instance**.
   - Choose **Amazon Linux 2 AMI**.
   - Select `t2.medium` as the instance type.
   - Add storage: `20-30 GB`.
   - Configure the security group:
     - Allow ports: `22` (SSH), `80` (web server), `8080` (Jenkins), and `3000` (Node.js).
   - Launch the instance.

3. **Post-Launch Setup**:
   - SSH into the instance:
     ```bash
     ssh -i your_key.pem ec2-user@<instance-ip>
     ```
   - Update the server:
     ```bash
     sudo yum update -y
     ```

---

## Step 2: Install and Configure Jenkins

### Objective:
Install Jenkins on the EC2 instance and make it accessible via a web browser.

### Why?
Jenkins is a popular automation tool used to build and manage CI/CD pipelines.

### Actions:
1. **Install Prerequisites**:
   - Update system packages:
     ```bash
     sudo yum update -y
     ```
   - Install Java:
     ```bash
     sudo amazon-linux-extras enable corretto17
     sudo yum install -y java-17-amazon-corretto
     java -version  # Verify the installation
     ```

2. **Install Jenkins**:
   - Add Jenkins repository and key:
     ```bash
     sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
     sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
     ```
   - Install Jenkins:
     ```bash
     sudo yum install -y jenkins
     ```
   - Start and enable Jenkins:
     ```bash
     sudo systemctl start jenkins
     sudo systemctl enable jenkins
     ```
   - Verify Jenkins status:
     ```bash
     sudo systemctl status jenkins
     ```

3. **Access Jenkins**:
   - Open a browser and navigate to:
     ```
     http://<instance-ip>:8080
     ```
   - Retrieve the administrator password:
     ```bash
     sudo cat /var/lib/jenkins/secrets/initialAdminPassword
     ```
   - Follow the setup wizard, install suggested plugins, and create an admin user.

---

## Step 3: Install Node.js

### Objective:
Set up Node.js to run and manage your application on the EC2 instance.

### Why?
Node.js is a lightweight and efficient platform for building scalable web applications.

### Actions:
1. Add the Node.js repository:
   ```bash
   curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
   ```
2. Install Node.js and npm:
   ```bash
   sudo yum install -y nodejs
   ```
3. Verify installation:
   ```bash
   node -v
   npm -v
   ```

---

## Step 4: Install Docker

### Objective:
Install Docker to build and run containers for your application.

### Why?
Docker enables you to containerize your application, making it portable and easy to deploy.

### Actions:
1. Install Docker:
   ```bash
   sudo yum install docker -y
   ```
2. Start and enable Docker:
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```
3. Verify Docker installation:
   ```bash
   docker --version
   ```
4. Add the Jenkins user to the Docker group:
   ```bash
   sudo usermod -aG docker jenkins
   sudo systemctl restart jenkins
   sudo systemctl restart docker
   ```

---

## Step 5: Containerize the Application

### Objective:
Create a Docker image for your Node.js application and deploy it in a container.

### Why?
Containerizing the application ensures consistency across environments and simplifies deployment.

### Actions:
1. Create a `Dockerfile` in the project root directory:
   ```dockerfile
   FROM node:16
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   ```
2. Build the Docker image:
   ```bash
   docker build -t ecommerce-app .
   ```
3. Run the Docker container:
   ```bash
   docker run -d -p 3000:3000 --name ecommerce-container ecommerce-app
   ```
4. Test the application:
   - Open your browser and go to:
     ```
     http://<instance-ip>:3000
     ```
   - For health check:
     ```
     http://<instance-ip>:3000/health
     ```

---

## Step 6: Push the Docker Image to a Registry

### Objective:
Store your Docker image in a registry for easy access and deployment.

### Why?
Using a registry allows you to share and deploy the image across environments.

### Actions:
1. Log in to Docker Hub:
   ```bash
   docker login
   ```
2. Tag and push the image:
   ```bash
   docker tag ecommerce-app <username>/ecommerce-app:latest
   docker push <username>/ecommerce-app:latest
   ```
3. Pull the image (for verification):
   ```bash
   docker pull <username>/ecommerce-app:latest
   ```

---

## Step 7: Enhance Your CI/CD Pipeline

### Key Options to Consider:
1. **Automate Deployment to a Cloud Platform (AWS EC2)**:
   - Deploy your containerized application to a cloud environment to make it publicly accessible.

### Actions:
1. **Use Terraform to Create an AWS EC2 Instance**:
   - Configure Terraform to provision an EC2 instance with required security group rules.
   - Deploy the Dockerized application to the EC2 instance via Jenkins.

### Provide AWS Credentials to Terraform:
1. **Configure AWS CLI**:
   - Run the following command:
     ```bash
     aws configure
     ```
   - Provide the following details:
     - AWS Access Key ID: `<Your_AWS_Access_Key_ID>`
     - AWS Secret Access Key: `<Your_AWS_Secret_Access_Key>`
     - Default region: `us-east-1` (or your preferred region).
     - Default output format: `json` (optional).
   - Verify credentials:
     ```bash
     cat ~/.aws/credentials
     ```

### Workflow Overview:
1. **Terraform**:
   - Provision the EC2 instance with necessary security group rules.
   - Output instance details (e.g., public IP) for Ansible to use.
2. **Ansible**:
   - Use the Terraform-provided instance details.
   - SSH into the instance and:
     - Install Docker.
     - Configure Docker to start at boot.
     - Deploy and run the container.

### Steps to Implement:

#### Terraform Configuration:
1. Create a `main.tf` file:
   ```hcl
   provider "aws" {
     region = "us-east-1"
   }

   resource "aws_security_group" "allow_ssh_http" {
     name_prefix = "allow_ssh_http_"

     ingress {
       from_port   = 22
       to_port     = 22
       protocol    = "tcp"
       cidr_blocks = ["0.0.0.0/0"]
     }

     ingress {
       from_port   = 3000
       to_port     = 3000
       protocol    = "tcp"
       cidr_blocks = ["0.0.0.0/0"]
     }

     egress {
       from_port   = 0
       to_port     = 0
       protocol    = "-1"
       cidr_blocks = ["0.0.0.0/0"]
     }

     tags = {
       Name = "allow_ssh_http"
     }
   }

   resource "aws_instance" "web" {
     ami           = "ami-0c02fb55956c7d316"
     instance_type = "t2.micro"
     security_groups = [aws_security_group.allow_ssh_http.name]
     key_name = "your-key-pair-name"

     tags = {
       Name = "Terraform-Managed-Instance"
     }
   }

   output "public_ip" {
     value = aws_instance.web.public_ip
   }
   ```
2. Run Terraform:
   - Initialize Terraform:
     ```bash
     terraform init
     ```
   - Apply Terraform:
     ```bash
     terraform apply
     ```
   - Note the public IP output.
