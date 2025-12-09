# AI Project with React and Node.js

This project is an AI-powered web application built with **React** for the frontend and **Node.js (Express, TypeScript)** for the backend. The React app is served directly from the Node.js server (`server.ts`), allowing seamless integration of API endpoints and static frontend assets.

---

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Available Scripts](#available-scripts)
- [Docker Instructions](#docker-instructions)
- [Azure Deployment](#azure-deployment)
- [Debugging and Logs](#debugging-and-logs)

---

## ✨ Features

- ⚡ **AI-driven features** with ML practice components
- 🖥️ **React frontend** served from Node.js Express backend
- 🔗 **REST API endpoints** for dynamic data
- 🚀 **Production-ready**: Single server for both frontend and backend
- 🐳 **Dockerized**: Build and deploy using Docker
- ☁️ **Azure-ready**: Deploy to Azure Web App with Docker support
- 📚 **ML Learning Hub**: Includes visual search, decision trees, regression, and optimization algorithms

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** (v8 or higher)
- **Docker** (for containerization)
- **Azure CLI** (for Azure deployment)

Install Azure CLI on macOS:
```sh
brew install azure-cli
az version
```

---

## 🚀 Local Development

### 1. Install Dependencies
```sh
npm install
```

### 2. Run Development Server
```sh
npm start
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

### 3. Run Production Server
```sh
npm run start:server
```
This builds both React and TypeScript server, then starts the production server.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

---

## 🐳 Docker Instructions

### Build Docker Image

#### For macOS (local testing)
```sh
docker build -t tbudhe-ik-ai-agent .
```

#### For Azure (Linux AMD64)
```sh
docker buildx build --platform linux/amd64 -t tbudhe-ik-arm6x-ai-agent .
```

### Run Docker Container Locally

```sh
docker run -p 3000:3000 tbudhe-ik-ai-agent
```

Access at [http://localhost:3000](http://localhost:3000)

---

## ☁️ Azure Deployment

### Step 1: Login to Azure

```sh
az login
```

### Step 2: Create Azure Resources

```sh
# Create Resource Group
az group create \
  --location eastus \
  --resource-group resource-group-tbudhe-ik-ai-agent

# Create Azure Container Registry
az acr create \
  --name azreglinuxik \
  --resource-group resource-group-tbudhe-ik-ai-agent \
  --sku Basic

# Enable Admin Access
az acr update \
  --name azreglinuxik \
  --admin-enabled true

# Get ACR Credentials
az acr credential show --name azreglinuxik

# Create App Service Plan (Free Tier)
az appservice plan create \
  --name az-paas-service-linux-free-plan \
  --resource-group resource-group-tbudhe-ik-ai-agent \
  --is-linux \
  --sku F1 \
  --location eastus2
```

### Step 3: Build and Push Docker Image to ACR

```sh
# Build for Linux AMD64
docker buildx build --platform linux/amd64 -t tbudhe-ik-arm6x-ai-agent .

# Tag the image for ACR
docker tag tbudhe-ik-arm6x-ai-agent azreglinuxik.azurecr.io/tbudhe-ik-arm6x-ai-agent

# Login to ACR
az acr login --name azreglinuxik

# Push image to ACR
docker push azreglinuxik.azurecr.io/tbudhe-ik-arm6x-ai-agent

# Verify image in ACR
az acr repository list --name azreglinuxik --output table
```

### Step 4: Create and Configure Web App

```sh
# Create Web App
az webapp create \
  --resource-group resource-group-tbudhe-ik-ai-agent \
  --plan az-paas-service-linux-free-plan \
  --name gen-ai-ik-demo \
  --deployment-container-image-name azreglinuxik.azurecr.io/tbudhe-ik-arm6x-ai-agent

# Configure App Settings
az webapp config appsettings set \
  --resource-group resource-group-tbudhe-ik-ai-agent \
  --name gen-ai-ik-demo \
  --settings WEBSITES_PORT=3000 WEBSITE_NODE_DEFAULT_VERSION=20

# Restart Web App
az webapp restart \
  --name gen-ai-ik-demo \
  --resource-group resource-group-tbudhe-ik-ai-agent

# Verify Web App Status
az webapp show \
  --resource-group resource-group-tbudhe-ik-ai-agent \
  --name gen-ai-ik-demo \
  --query state
```

### Step 5: Access Your Deployed App

🌐 [https://gen-ai-ik-demo.azurewebsites.net](https://gen-ai-ik-demo.azurewebsites.net)

## 🐛 Debugging and Logs

### View Live Application Logs
```sh
az webapp log tail \
  --resource-group resource-group-tbudhe-ik-ai-agent \
  --name gen-ai-ik-demo
```

### Check DNS Resolution
```sh
nslookup gen-ai-ik-demo.azurewebsites.net
```

### Configure Managed Identity (for ACR access)

```sh
# Assign Identity to Web App
PRINCIPAL_ID=$(az webapp identity assign \
  --resource-group resource-group-tbudhe-ik-ai-agent \
  --name gen-ai-ik-demo \
  --query principalId --output tsv)

# Grant ACR Pull Role
az role assignment create \
  --assignee $PRINCIPAL_ID \
  --scope /subscriptions/<subscription-id>/resourceGroups/resource-group-tbudhe-ik-ai-agent/providers/Microsoft.ContainerRegistry/registries/azreglinuxik \
  --role "AcrPull"
```

---

## 📝 Project Structure

```
tushar-kick-open-ai-react/
├── public/               # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── pages/      # Page components (AI, Home, PracticeML, etc.)
│   │   ├── menu/       # Navigation menu
│   │   └── cards/      # Reusable card components
│   ├── css/            # Stylesheets
│   ├── ml/             # ML practice resources
│   └── App.tsx         # Main App component
├── server/             # Server-side code
├── server.ts           # Express server entry point
├── Dockerfile          # Docker configuration
└── package.json        # Dependencies and scripts
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and maintained by Tushar Budhe.

---

## 🔗 Useful Links

- [Azure Web App](https://gen-ai-ik-demo.azurewebsites.net)
- [Azure Portal](https://portal.azure.com)
- [Docker Hub](https://hub.docker.com)
- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)


