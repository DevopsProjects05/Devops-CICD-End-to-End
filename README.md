# CI/CD Pipeline with Node.js, Prometheus, Grafana, and Slack Notifications

This README file provides a step-by-step guide to deploy a CI/CD pipeline for a Node.js-based application using Jenkins, Docker, Terraform, Prometheus, Grafana, and Slack notifications. The guide assumes no prior experience and provides detailed instructions for a successful deployment.

---

Project Overview
Tools and Technologies Used:
<p align="center"> <img src="https://img.icons8.com/color/48/000000/jenkins.png" alt="Jenkins" title="Jenkins"/> <img src="https://img.icons8.com/color/48/000000/docker.png" alt="Docker" title="Docker"/> <img src="https://img.icons8.com/color/48/000000/terraform.png" alt="Terraform" title="Terraform"/> <img src="https://img.icons8.com/color/48/000000/nodejs.png" alt="Node.js" title="Node.js"/> <img src="https://img.icons8.com/color/48/000000/prometheus-app.png" alt="Prometheus" title="Prometheus"/> <img src="https://img.icons8.com/color/48/000000/grafana.png" alt="Grafana" title="Grafana"/> <img src="https://img.icons8.com/color/48/000000/slack-new.png" alt="Slack" title="Slack"/> <img src="https://img.icons8.com/color/48/000000/sonarqube.png" alt="SonarQube" title="SonarQube"/> </p>

### Features:
- Clone the source code from GitHub.
- Run tests using Jest.
- Build and push Docker images to Docker Hub.
- Deploy infrastructure using Terraform.
- Monitor application metrics with Prometheus and Grafana.
- Send pipeline status notifications to Slack.

---

## Prerequisites

### Tools to Install:
1. [Jenkins](https://www.jenkins.io/)
2. [Docker](https://www.docker.com/)
3. [Terraform](https://www.terraform.io/)
4. [Node.js and npm](https://nodejs.org/)
5. [Prometheus](https://prometheus.io/)
6. [Grafana](https://grafana.com/)
7. Slack workspace (optional, for notifications)

### Setup Required:
1. **GitHub Repository:**
   - Clone this repository: [DevOps CI/CD Project](https://github.com/DevopsProjects05/Devops-CICD-End-to-End.git).

2. **Jenkins Plugins:**
   - Docker Pipeline
   - Terraform
   - Slack Notifications
   - SonarQube Scanner (optional)

3. **Credentials:**
   - Docker Hub credentials
   - AWS credentials
   - Slack webhook URL

---

## Step-by-Step Guide

### Step 1: Set Up Jenkins
1. Install Jenkins on your machine or use an existing instance.
2. Install the required plugins mentioned in the prerequisites.
3. Configure credentials in Jenkins:
   - AWS credentials
   - Docker Hub credentials
   - Slack webhook (use the "Slack Notification" plugin).

### Step 2: Clone the Repository
1. Create a new pipeline job in Jenkins.
2. Use the following GitHub repository URL:
   `https://github.com/DevopsProjects05/Devops-CICD-End-to-End.git`

### Step 3: Run Tests
1. Ensure `npm` is installed on your Jenkins server.
2. Install dependencies and run tests:
   ```bash
   npm install
   npm test
   ```

### Step 4: Build Docker Image
1. Create a `Dockerfile` in the `src` directory of your project.
2. Use the following command to build the Docker image:
   ```bash
   docker build -t <your-dockerhub-username>/ecommerce-nodejs:v1 .
   ```

### Step 5: Push Docker Image to Docker Hub
1. Log in to Docker Hub:
   ```bash
   docker login -u <your-dockerhub-username> -p <your-password>
   ```
2. Push the image:
   ```bash
   docker push <your-dockerhub-username>/ecommerce-nodejs:v1
   ```

### Step 6: Deploy Infrastructure with Terraform
1. Navigate to the `Terraform` directory.
2. Run the following commands:
   ```bash
   terraform init
   terraform validate
   terraform apply -auto-approve
   ```
3. Terraform will create an EC2 instance with your Node.js application running on port 3000.

### Step 7: Set Up Prometheus
1. Download Prometheus and extract it:
   ```bash
   wget https://github.com/prometheus/prometheus/releases/download/v2.x.x/prometheus-2.x.x.linux-amd64.tar.gz
   tar -xvf prometheus-2.x.x.linux-amd64.tar.gz
   ```
2. Update the `prometheus.yml` file:
   ```yaml
   scrape_configs:
     - job_name: 'nodejs-app'
       static_configs:
         - targets: ['<EC2-Public-IP>:3000']
   ```
3. Start Prometheus:
   ```bash
   ./prometheus --config.file=prometheus.yml
   ```

### Step 8: Set Up Grafana
1. Download and start Grafana.
2. Add Prometheus as a data source in Grafana:
   - URL: `http://localhost:9090`
3. Create a dashboard with the following query:
   ```bash
   http_request_duration_seconds_count
   ```

### Step 9: Configure Slack Notifications
1. Create a Slack app and generate a webhook URL.
2. Add the webhook URL to the Jenkins Slack plugin.
3. Add a post-build action to send notifications:
   ```groovy
   slackSend(channel: '#pipeline-alerts', color: 'good', message: 'Pipeline completed successfully!')
   ```

---

## Validation
- **Jenkins Pipeline**: Check the stages and logs for success.
- **Prometheus**: Verify metrics at `/metrics` endpoint.
- **Grafana**: Visualize metrics in the dashboard.
- **Slack**: Check for notifications in the configured channel.

---

## Troubleshooting
1. **Port Conflict:** Ensure no other service is running on port 3000.
2. **Terraform Issues:** Check AWS credentials and ensure the IAM role has proper permissions.
3. **Slack Notifications Fail:** Verify the webhook URL and Slack workspace settings.
4. **Prometheus Targets Down:** Ensure the Node.js application is running and the endpoint is reachable.

---

## Conclusion
By following this README, you can set up a fully functional CI/CD pipeline for a Node.js application, complete with monitoring and notifications. For any issues, refer to the troubleshooting section.

