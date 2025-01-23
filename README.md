## Automated CI/CD Pipeline for Node.js Applications

### Project Overview

**This project showcases a comprehensive CI/CD pipeline designed to automate the deployment of a Node.js application. It integrates modern DevOps tools such as Jenkins, Docker, Terraform, SonarQube, Prometheus, Grafana, and Slack to ensure scalability, monitoring, and maintainability for real-world applications.**

To provide a deeper understanding of the deployment workflow, this project demonstrates both **manual and automated** approaches. Initially, the deployment was performed manually to verify and ensure that all components were configured correctly and working as expected. Once validated, the process was automated using a Jenkinsfile, enabling faster, repeatable, and more reliable deployments...

---

# Table of Contents

1. [Project Overview](#project-overview)  
2. [Prerequisites](#prerequisites)  
3. [Architecture](#architecture)  
4. [Manual Deployment Steps](#manual-deployment-steps)  
   - [Step 1: Create the EC2 Instance](#step-1-create-the-ec2-instance)  
   - [Step 2: Install Required Tools](#step-2-install-required-tools)  
   - [Step 3: Clone the Project Repository](#step-3-clone-the-project-repository)  
   - [Step 4: Install Project Dependencies](#step-4-install-project-dependencies)  
   - [Step 5: Prepare Docker Environment](#step-5-prepare-docker-environment)  
   - [Step 6: Deploy Infrastructure with Terraform](#step-6-deploy-infrastructure-with-terraform)  
   - [Step 7: Install Jenkins](#step-7-install-jenkins)  
   - [Step 8: SonarQube Setup](#step-8-sonarqube-setup)  
     
5. [Automating with Jenkins Pipeline](#automating-with-jenkins-pipeline)  
   - [Creating Jenkins Pipeline](#creating-jenkins-pipeline)  
   - [Integrating Slack Notifications](#integrating-slack-notifications) 
6.  [Monitoring with Prometheus and Grafana](#monitoring-with-prometheus-and-grafana) 
7. [Validation and Testing](#validation-and-testing)  
8. [Future Enhancements](#future-enhancements)  
9. [Challenges and Learnings](#challenges-and-learnings)


---



### Prerequisites

- **AWS Account:** Required for provisioning EC2 instances and other resources.

- **Git:** Version Control System.

- **Docker:** Containerization.

- **Terraform:** Infrastructure as Code.

- **Node.js:** Backend runtime.

- **Jenkins:** CI/CD tool.

- **SonarQube:** Code Quality Tool.

- **Prometheus and Grafana:** Monitoring and Visualization Tools.
- **Slack API:** For pipeline notifications.

---
### Architecture
---


![](/images/CI-CD-%20Architecture.jpg)

---

## Manual Deployment Steps:

## Step 1: Create the EC2 Instance

### Objective
Launch an EC2 instance to host the CI/CD pipeline with appropriate configurations.

### Actions
1. **Instance Configuration**:
    - **Instance Type**: t3.xlarge
    - **Volume**: 30 GB
2. **Manual Steps**:
    - Go to **AWS Console > EC2 > Launch Instance**.
    - Choose **Amazon Linux 2 AMI**.
    - Select **t3.xlarge** as the instance type.
    - Add **30 GB storage**.
    - Configure the security group with the following ports:
      - **22:** This port is used for SSH
      - **8080:** This port is used for Jenkins
      - **9000:** This port is used for SonarQube
      - **9090:** This port is used for Prometheus
      - **3001:** This port is used for Grafana
      - **3000:** This port is used for the Node.js server
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

## Step 2: Install Required Tools

### Install Basic Tools
Run the following commands:
```bash
sudo yum install git wget unzip curl -y
```

### Install Node.js and npm
```bash
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
```
```bash
sudo yum install nodejs -y
```
```bash
node -v
```
```bash
npm -v
```

---

## Step 3: Clone the Project Repository


1. Clone your GitHub repository:
   ```bash
   git clone https://github.com/DevopsProjects05/Devops-CICD-End-to-End.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Devops-CICD-End-to-End
   ```


---

## Step 4: Install Project Dependencies

1. Navigate to the `src` directory:
   ```bash
   cd src
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify the installation:
   ```bash
   ls node_modules
   ```
4. Start the application:
   ```bash
   node server.js
   ```
5. Access the application at: `http://<public-ip>:3000`.

### Below is the result you can expect:

---

![](/images/1.NodeJs.jpg)

---

## Step 5: Prepare Docker Environment

### Install Docker

1. Install Docker:
   ```bash
   sudo yum install docker -y
   ```
2. Start and enable Docker:
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```
3. Add the user to the Docker group:
   ```bash
   sudo usermod -aG docker jenkins
   ```
4. Verify Docker installation:
   ```bash
   docker --version
   ```

### Build the Docker Image (Skip this step, as the Dockerfile is already stored in the `src` directory)
You can proceed directly to the next step (Build the Docker image)
   ```dockerfile
   FROM node:16
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```
1. Build the Docker image:
   ```bash
   docker build -t ecommerce-nodejs:v1 .    #If you want to change image name you can 
   ```
2. Verify the image:
   ```bash
   docker images
   ```
### Your output will resemble the example below:
---

   ![](/images/2.Docker-image-build.jpg)

---

### Run the Docker Container
1. Start the container:
   ```bash
   docker run -d -p 3000:3000 --name ecommerce-app ecommerce-nodejs:v1
   ```
2. Verify the container:
   ```bash
   docker ps
   ```
3. Access the application: `http://<Your-EC2-Public-IP>:3000`.

### The following results confirm a successful execution:

---

![](/images/1.NodeJs.jpg)

---

## Push Docker Image to Docker Hub

### Actions
1. Log in to Docker Hub:
   ```bash
   docker login -u <your-dockerhub-username> -p <your-dockerhub-password>
   ```
2. Tag the image:
   ```bash
   docker tag <Image-name> <your-dockerhub-username>/ecommerce-nodejs:v1          # Replace with your image name
   ```
3. Push the image:
   ```bash
   docker push <your-dockerhub-username>/ecommerce-nodejs:v1
   ```
4. Verify on Docker Hub.

### After running the steps, the output will appear as follows:

---
![](/images/3.Docker-image.jpg)

---

## Step 6: Deploy Infrastructure with Terraform

### Install Terraform
1. Download Terraform:
   ```bash
   wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
   ```
2. Unzip and move to the path:
   ```bash
   unzip terraform_1.6.0_linux_amd64.zip
   sudo mv terraform /usr/local/bin/
   ```
3. Verify the installation:
   ```bash
   terraform -v
   ```

### Prepare Terraform Configuration
1. Navigate to the Terraform directory:
   ```bash
   cd terraform
   ```
2. Add your AWS credentials in `Provider.tf`:
   ```bash
   vi Provider.tf
   ```
   Add your access and secret keys as shown in the example below:
   ```hcl
   provider "aws" {
     access_key = "<your-access-key>"
     secret_key = "<your-secret-key>"
     region     = "us-east-1"
   }
   ```

### Deploy Infrastructure
1. Initialize Terraform:
   ```bash
   terraform init
   ```
2. Validate and plan:
   ```bash
   terraform validate
   terraform plan
   ```
3. Apply the configuration:
   ```bash
   terraform apply -auto-approve
   ```
4. Access the application: `http://<EC2-Public-IP>:3000`.

### Below is the output you should see after following the steps:

---

![](/images/1.NodeJs.jpg)

---

### Step 7: Install Jenkins
1. Add Jenkins repository:
   ```bash
   sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat/jenkins.repo
   sudo rpm --import https://pkg.jenkins.io/redhat/jenkins.io-2023.key
   ```

2. Install Java 17:
   ```bash
   amazon-linux-extras enable corretto17
   sudo yum install -y java-17-amazon-corretto
   java -version
   ```
3. Install Jenkins:
   ```bash
   sudo yum install jenkins -y
   ```
4. Start Jenkins:
   ```bash
   sudo systemctl start jenkins
   sudo systemctl enable jenkins
   ```

## Jenkins Initial Setup
### Access Jenkins
Once you access Jenkins at `http://<Jenkins-Instance-IP>:8080`, you will see the following page:


---
![](/images/6.jenkins.jpg)

---

### Retrieve the Initial Admin Password
Copy the file path shown on the page and run the following command in the terminal:
```bash
cat /var/lib/jenkins/secrets/initialAdminPassword
```


### Create Jenkins User
After entering the initial admin password, you will be redirected to a page to set up a Jenkins user account. Fill in the required details as shown below:

---

![](/images/7.create-user.jpg)

---

Provide the necessary details to create your Jenkins account, then  select **Install the suggested plugins** and login to your account.

## Integrate Jenkins with Tools

### Install necessary plugins: Pipeline, SonarQube Scanner, Docker Pipeline, Terraform, etc.

#### Steps to Install Plugins:
- Go to the Jenkins dashboard.
- Click on **Manage Jenkins** and then **Plugins**.
- Select **Available Plugins**.
- Search for and install the following plugins:
  - Pipeline
  - SonarQube Scanner
  - Docker Pipeline
  - Terraform
  - Slack Notification
  - AWS Credentials

### Follow the below screenshot

---
![](/images/8.jenkins-plugins.jpg)

---

After installing all the plugins, restart Jenkins:
```bash
sudo systemctl restart jenkins
```
## Configure credentials for Docker Hub, AWS, and SonarQube
#### Add Docker Credentials to Jenkins
1. Go to **Manage Jenkins > Credentials**.
2. Select the appropriate scope (e.g., Global).
3. Click on **(global) > Add Credentials**.
4. Choose **Username with password** as the type:
   - **Username**: Docker Hub username
   - **Password**: Docker Hub password
   - **ID**: Use an identifier like `dockerhub-credentials`.
5. Save the credentials.

#### Add AWS Credentials to Jenkins
1. Go to **Manage Jenkins > Credentials**.
2. Select the appropriate scope (e.g., Global).
3. Click on **(global) > Add Credentials**.
4. Choose **AWS Credentials** as the type:
   - **Access Key ID**: Your AWS access key.
   - **Secret Access Key**: Your AWS secret key.
   - **ID**: Use an identifier like such as. `aws-credentials`.
5. Save the credentials.

### Step 8: SonarQube Setup
#### Run SonarQube Container
1. Create and run a SonarQube container:
   ```bash
   docker run -d --name sonarcontainer -p 9000:9000 sonarqube:latest
   ```
2. Access SonarQube in the browser:
   - URL: `http://<your-ec2-ip>:9000`
---

![](/images/9.sonar.jpg)

---

- Login: Username: `admin`, Password: `admin` (you will be prompted to reset the password).

   Provide a new Password : `Example@12345`

---

![](/images/10.sonar-update.jpg)


---

#### Add SonarQube Configuration to Jenkins
1. Go to **Manage Jenkins > Configure System**.
2. Scroll to **SonarQube Servers** and click **Add SonarQube**.
3. Enter the following details:
   - **Name**: SonarQube server (or any identifier).
   - **Server URL**: `http://<your-sonarqube-server-ip>:9000`.
  ---
![](/images/14.sonarserver-add.jpg)

---   
4. Save the configuration.


 **Note:** Store `sonar.projectName`, `sonar.projectKey`, and `Token` in a separate place.
 
#### Create a New Project in SonarQube
1. Log in to SonarQube.
2. Click **Create New Project** and provide the project name (e.g., `Sample E-Commerce Project`).
3. Select **Use the global setting**, then click **Create Project**.

#### Generate an Authentication Token
1. Navigate to **My Account > Security**.
2. Under **Generate Tokens**, enter a token name (e.g., `SampleProjectToken`).
3. Select **Global Analysis** from the dropdown.
4. Click **Generate** and copy the token (save it securely; it will not be displayed again).

#### Install Sonar Scanner
1. Create a directory for Sonar Scanner:
   ```bash
   mkdir -p /downloads/sonarqube
   cd /downloads/sonarqube
   ```
2. Download the latest Sonar Scanner:
   ```bash
   wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
   unzip sonar-scanner-cli-5.0.1.3006-linux.zip
   ```
   ```bash
   sudo mv sonar-scanner-5.0.1.3006-linux /opt/sonar-scanner
   ```
3. Add Sonar Scanner to the PATH:
   ```bash
   vi ~/.bashrc
   ```
   ```bash
   export PATH="/opt/sonar-scanner/bin:$PATH"
   ```
  Add the path as shown below:

  ---

![](/images/11.sonarpath.jpg)

---

   ```bash
   source ~/.bashrc
   ```
4. Verify the installation:
   ```bash
   sonar-scanner --version
   ```

#### Analyze Code with Sonar Scanner
1. Navigate to the `src` directory.
   ```bash
   cd src
   ```
2. Create and edit the `sonar-project.properties` file:
   ```bash
   vi sonar-project.properties           
   ```
   Add the following content:
   ```
   # Unique project identifier in SonarQube
   sonar.projectKey=SampleECommersProject     # Replace with your Project key

   # Display name of the project
   sonar.projectName=Sample E-Commerce Project  # Replace with your Project Name

   # Directory where source code is located (relative to this file)
   sonar.sources=.

   # URL of the SonarQube server
   sonar.host.url=http://<your-sonarqube-server-ip>:9000    # Replace with your Sonarqube server IP

   # Authentication token from SonarQube
   sonar.login=<your-authentication-token>    # Replace with your Token
   ```
3. Run the Sonar Scanner:
   ```bash
   /opt/sonar-scanner/bin/sonar-scanner
   ```

  ### You will see below result after running sonar scanner:

  ---

  ![](/images/12.sonar-success.jpg)
   
   ---

4. For debugging issues, use:
   ```bash
   /opt/sonar-scanner/bin/sonar-scanner -X
   ```

   If you get an error:
   - Ensure your SonarQube server IP is configured in Jenkins.
   - Verify that your project key and authentication token are correct.
   - Make sure you are in the correct path (`/src`).
   - Confirm that the `sonar-project.properties` file exists in the `/src` directory.

#### View Results in SonarQube
1. Open your browser and navigate to `http://<your-sonarqube-server-ip>:9000`.
2. Log in to the SonarQube dashboard.
3. Locate the project (e.g., `Sample E-Commerce Project`).
4. View analysis results, including security issues, reliability, maintainability, and code coverage.

### The following output will be visible upon successful execution:

---

![](/images/13.sonar-ui-pass.jpg)

---

### Automating with Jenkins Pipeline

### Creating Jenkins Pipeline

1. In the Jenkins dashboard, click on **+ New Item** or **New Job**.
2. Provide a name (e.g., Jenkins Pipeline).
3. Select **Pipeline** and click **OK** to proceed.
4. In the left-side menu, click **Configure**.
5. In the **Pipeline** section:
   - in **Definition** select  **Pipeline script from SCM**.
   - Under **SCM**, select **Git**.
   - Provide the repository URL: `https://github.com/DevopsProjects05/Devops-CICD-End-to-End.git`.
   - In **Branches to build**, enter: `*/main`.
   - For **Script Path**, enter: `Jenkinsfile`.
6. Click **Apply** and **Save**.

### Before Building Pipeline Ensure:
1. Ensure you are adding the correct SonarQube name, project key, and token.
2. Ensure you are providing the correct name for Docker credentials: `dockerhub-credentials`.

## Integrating Slack Notifications

 For Slack notification setup: follow the video [here](https://www.youtube.com/watch?v=9ZUy3oHNgh8&t=789s).

##### This page will be displayed after successfully creating the Slack notification

---
![](/images/slack.jpg)

---
## Jenkinsfile Summary:

This Jenkinsfile automates the CI/CD pipeline for an **e-commerce project.** It begins by **cloning** the code from a **GitHub repository,** performs a **SonarQube analysis** to ensure code quality, and **runs tests** to validate application stability. Following this, it builds and pushes a **Docker image** to Docker Hub and provisions **AWS infrastructure** using **Terraform.** Lastly, the pipeline sends **Slack notifications** to report the build status, enabling a seamless and automated deployment workflow.

### You will see the stage view of your pipeline:

---
![](/images/jenkins-pipeline.jpg)

---

## Monitoring with Prometheus and Grafana

### Add Prometheus to Node.js Application
1. Install Prometheus client:
   ```bash
   npm install prom-client
   ```
2. Expose metrics in `server.js`. (included expose metrics in server.js)

#### Next Steps
1. Test this updated `server.js` locally:
   ```bash
   node server.js
   ```
2. Access Prometheus metrics at: `http://<public-ip>:3000/metrics` to ensure it is working as expected.

### You will see the metrics once you access the URL:

---

![](/images/metrics.jpg)

---

### Open a Separate Terminal for Prometheus Setup
1. **Right-click** on the tab of your terminal session.
2. From the context menu, select the option **'Duplicate Session'**.
3. This will open a new tab with a duplicate of your current terminal session, which you can use to continue the setup process.
4. After entering into the duplicate terminal, get sudo access and navigate to:
   ```bash
   cd Devops-CICD-End-to-End/src/
   ```



### Install and Configure Prometheus
1. Download and run Prometheus:
   ```bash
   wget https://github.com/prometheus/prometheus/releases/download/v2.47.0/prometheus-2.47.0.linux-amd64.tar.gz
   ```
   ```bash
   tar -xvzf prometheus-2.47.0.linux-amd64.tar.gz
   ```
   ```bash
   cd prometheus-2.47.0.linux-amd64
   ```
   

#### Configure Prometheus

Inside the Prometheus Folder:
Edit the default `prometheus.yml` file or create your own.

```yaml
global:
  scrape_interval: 15s  # Default scrape interval

scrape_configs:
  - job_name: 'nodejs-app'  # Job name for the Node.js app
    static_configs:
      - targets: ['localhost:3000']  # Replace 'localhost' with the correct IP/hostname if needed
```     
Save the file in the same directory as Prometheus.

#### Run Prometheus

To start the Prometheus server, use the following command:

  ```bash
   ./prometheus --config.file=prometheus.yml
   ```
**Prometheus Server**: http://public-ip:9090/

##### Verify Prometheus Server

- Open the Prometheus server in your browser.

- Navigate to the Status tab.

- Choose Targets from the dropdown.


### Below is the result you can expect:

---

![](/images/prometheus.jpg)

---

### Open a Separate Terminal for Grafana Setup
1. **Right-click** on the tab of your terminal session.
2. From the context menu, select the option **'Duplicate Session'**.
3. This will open a new tab with a duplicate of your current terminal session, which you can use to continue the setup process.
4. After entering into the duplicate terminal, get sudo access and navigate to:
   ```bash
   cd Devops-CICD-End-to-End/src/
   ```

### Install and Configure Grafana
1. Download and run Grafana:
   ```bash
   wget https://dl.grafana.com/oss/release/grafana-10.0.0.linux-amd64.tar.gz
   ```
   ```bash
   tar -xvzf grafana-10.0.0.linux-amd64.tar.gz
   ```
   ```bash
   cd grafana-10.0.0/bin
   ```
   Run Grafana

   ```bash
   ./grafana-server
   ```

### Resolve Port Conflict with Grafana

You may encounter the following error because Grafana tries to access port 3000, which is already occupied by Node.js. To resolve this, we need to change the Grafana port to 3001.

#### Steps to Change the Grafana Port

1.Find the `defaults.ini` file by running the following command:
```bash
find / -name defaults.ini 2>/dev/null
```

2.Navigate to the `conf` directory:
```bash
cd ../conf
```

3.Edit the `defaults.ini` file:
```bash
vi defaults.ini
```
4.Add the following line to set the `Grafana port` to 3001:
```bash
http_port = 3001
```
---

![](/images/port-change.jpg)

--- 

#### Restart Grafana
Now, navigate back to the Grafana execution folder:

```bash
cd /root/Devops-CICD-End-to-End/src/prometheus-2.47.0.linux-amd64/grafana-10.0.0/bin
```
Run Grafana again:
```bash
./grafana-server  
```

   Access Grafana: `http://<server-ip>:3001`.

### You will see the below screen:

   ---
![](/images/grafana-1.jpg)
   ---

Login using default credentials:

Username: admin

Password: admin

Change the password upon first login.


### Once you login you will see Grafana Dashboard as shown below:

![](/images/grafana-dashboard.jpg)

#### Configure Prometheus as a Data Source
Add Prometheus as a data source.
 -  In Grafana, go to Configuration > **Data Sources**
 -  Click **Add data source.**

### The following page will appear:

   ---
   ![](/images/grafana-datasource.jpg)

   ---
   Select **`Prometheus`** from the list
   Enter Prometheus URL as shown below:

---
   ![](/images/grafana-prometheus.jpg)

---

#### Import a Pre-Built Dashboard
Go to Dashboards > toggle menu > dashboards > new> Import in Grafana.


---
![](/images/grafana-nodejs-id.jpg)

---

Enter a **Dashboard ID:**

Node js Dashboard: **11159** andclick on load and select **`Prometheus`** in prometheus

#### The interface will appear as follows:

---
![](/images/grafana-load-nodejs.jpg)

---

click on **import.**

### Here is the NodeJS Application Dashboard result after the process completes

---
![](/images/grafana-nodejs.jpg)

---

## Validation and Testing
1. Access all services (Jenkins, Node.js, Prometheus, Grafana) and verify the setup.
2. Confirm the CI/CD pipeline is functional.



## Congratulations! You have successfully set up a CI/CD pipeline for a Node.js application.


#### Future Enhancements

- Add Kubernetes for container orchestration.

- Automate rollback mechanisms in case of pipeline failures.

- Include security scanning tools like Trivy for container security.

- Enhance monitoring with alert mechanisms.

#### Challenges and Learnings

- Transitioning from manual to automated deployment highlighted the importance of a robust CI/CD pipeline in DevOps workflows.
- The manual process helped understand the inner workings of each tool, while automation streamlined the deployment, making it faster and less error-prone.

##### Challenges:

- Integrating SonarQube with Jenkins for real-time code analysis.

- Configuring Prometheus metrics for a Node.js application.

- Handling Docker image versioning and repository tagging.

##### Learnings:

- Improved understanding of infrastructure automation using Terraform.

- Hands-on experience with CI/CD best practices and monitoring.

- Streamlined Slack notifications for efficient team communication.

---






