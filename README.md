# AI Project with React and Node.js

This project is an AI-powered web application built with **React** for the frontend and **Node.js (Express, TypeScript)** for the backend. The React app is served directly from the Node.js server (`server.ts`), allowing seamless integration of API endpoints and static frontend assets.

---

## Features

- ⚡ **AI-driven features** (customize this section with your AI use-case, e.g., chat, recommendations, etc.)
- 🖥️ **React frontend** served from Node.js Express backend
- 🔗 **REST API endpoints** (e.g., `/api/menu`) for dynamic data
- 🚀 **Production-ready**: Single server for both frontend and backend
- 🐳 **Dockerized**: Build and deploy using Docker
- ☁️ **Azure-ready**: Easily deploy to Azure Web App with Docker support

---

## How to Run Locally

1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Run the app**
   ```sh
   npm start
   ```
   This will start both the React frontend and Node.js backend. Visit [http://localhost:3000](http://localhost:3000) to view the app.

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

## Docker Instructions

To build and run the project using Docker, follow these steps:

1. **Build the Docker image**
   
   ```sh
      # MAC OS
   docker build -t tbudhe-ik-ai-agent .
      # Linux CPU on Azure
   docker buildx build --platform linux/amd64 -t tbudhe-ik-arm6x-ai-agent .
   ```

2. **Run the Docker container**
   ```sh
      # MAC OS
   docker run -p 80:3000 --platform linux/amd64  tbudhe-ik-arm6x-ai-agent
      # Linux CPU on Azure
   docker buildx build --platform linux/amd64,linux/arm64 -t  tbudhe-ik-arm6x-ai-agent:latest --push 
   ```

   This maps port 3000 in the container to port 3000 on your host, allowing you to access the app at [http://localhost:3000](http://localhost:3000).

---

## Azure Container Registry (ACR) Instructions

To install the Azure CLI on macOS using Homebrew, run the following command: `brew install azure-cli`

Once the installation is complete, verify that the Azure CLI is installed by checking its version: `az version`

This will display the installed version of the Azure CLI. Let me know if you need further assistance!

To use Azure Container Registry (ACR) and push your Docker image:

1. **Create an Azure  Resources**
   ```sh
   az login
   az group create --location eastus --resource-group resource-group-tbudhe-ik-ai-agent
   az acr create  --name azurecontainerregistryik  --resource-group resource-group-tbudhe-ik-ai-agent --sku Basic
   az acr update -n azreglinuxik --admin-enabled true
   az acr credential show --name azurecontainerregistryik
   az appservice plan create  --name az-paas-service-linux-free-plan   --resource-group resource-group-tbudhe-ik-ai-agent --is-linux  --sku F1 --location eastus2
   az acr create  --name azreglinuxik  --resource-group resource-group-tbudhe-ik-ai-agent --sku Basic
   ```

2. **Tag your Docker image for ACR**
   ```sh
   docker tag tbudhe-ik-arm6x-ai-agent azreglinuxik.azurecr.io/tbudhe-ik-arm6x-ai-agent
   ```
3. **Login to your ACR**
   ```sh
   az acr login --name azreglinuxik
   ```
4. **Push the image to ACR**
   ```sh
   docker push azreglinuxik.azurecr.io/tbudhe-ik-arm6x-ai-agent
   ```
5. **Verify the image in ACR**
   ```sh
   az acr repository list --name azurecontainerregistryik --output table
   ```

## Deploy to Azure Web App

1. **Create the Web App**

```sh
az webapp create \
  --resource-group resource-group-tbudhe-ik-ai-agent \
  --plan az-paas-service-linux-free-plan \
  --name gen-ai-ik-demo \
  --deployment-container-image-name azurecontainerregistryik.azurecr.io/tbudhe-ik-arm6x-ai-agent
```

2. **Set Web App Configuration**

```sh
az webapp config appsettings set \
  --resource-group resource-group-tbudhe-ik-ai-agent \
  --name gen-ai-ik-demo \
  --settings WEBSITES_PORT=3000 WEBSITE_NODE_DEFAULT_VERSION=20
```

3. **Restart the Web App**

```sh
az webapp restart \
  --name gen-ai-ik-demo \
  --resource-group resource-group-tbudhe-ik-ai-agent
```

4. **Verify the Web App**

```sh
az webapp show \
  --resource-group resource-group-tbudhe-ik-ai-agent \
  --name gen-ai-ik-demo \
  --query state
```

5. **Access the Web App Open your browser and navigate to:**

[gen-ai-ik-demo](https://gen-ai-ik-demo.azurewebsites.net)

## Debugging and Logs

1. **View Web App Logs**
```sh
az webapp log tail \
  --resource-group resource-group-tbudhe-ik-ai-agent \
  --name gen-ai-ik-demo
  ```
  2. **Check DNS Resolution**

```sh
nslookup gen-ai-ik-demo.azurewebsites.net
```
3. **Assign Identity to Web App**

```sh
az webapp identity assign \
  --resource-group resource-group-tbudhe-ik-ai-agent \
  --name gen-ai-ik-demo \
  --query principalId --output tsv
  ```

4.  **Grant ACR Pull Role**

```sh
az role assignment create \
  --assignee <principal-id> \
  --scope /subscriptions/<subscription-id>/resourceGroups/resource-group-tbudhe-ik-ai-agent/providers/Microsoft.ContainerRegistry/registries/azurecontainerregistryik \
  --role "AcrPull"
```


