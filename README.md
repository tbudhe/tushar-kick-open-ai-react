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
   docker build -t tbudhe-ik-ai .
   ```
2. **Run the Docker container**
   ```sh
   docker run -p 80:3000 tbudhe-ik-ai
   ```
   This maps port 3000 in the container to port 3000 on your host, allowing you to access the app at [http://localhost:3000](http://localhost:3000).

---

## Azure Container Registry (ACR) Instructions

To use Azure Container Registry (ACR) and push your Docker image:

1. **Create an Azure Container Registry**
   ```sh
   az acr create --resource-group rg-ai-full-stack-demo --name acraikickdemo --sku Basic
   ```

2. **Tag your Docker image for ACR**
   ```sh
   docker tag tbudhe-ik-ai acraikickdemo.azurecr.io/tbudhe-ik-ai:latest
   ```
3. **Login to your ACR**
   ```sh
   az acr login --name acraikickdemo
   ```

4. **Push the image to ACR**
   ```sh
   docker push acraikickdemo.azurecr.io/tbudhe-ik-ai
   ```

az group create --location eastus --resource-group rg-ai-full-stack-demo

az acr create -n acraikickdemo -g rg-ai-full-stack-demo  --sku Basic
az acr update -n acraikickdemo --admin-enabled true

az appservice plan create --name myfreeappserviceplan --resource-group myresourcegroup --location eastus --is-linux --sku F1
az appservice plan create --resource-group rg-ai-full-stack-demo --name ai-ik-demo  --sku FREE --location eastus2

 az acr credential show --name acraikickdemo

az webapp config appsettings set --resource-group rg-ai-full-stack-demo --name gen-ai-ik-demo --settings WEBSITES_PORT=3000

az webapp create \
  --resource-group rg-ai-full-stack-demo \
  --plan ai-ik-demo \
  --name gen-ai-ik-demo \
  --deployment-container-image-name acraikickdemo.azurecr.io/tbudhe-ik-ai:latest
  -- NODE:20-lts


az webapp restart --name gen-ai-ik-demo  --resource-group rg-ai-full-stack-demo --settings WEBSITES_PORT=3000



az webapp config appsettings list --resource-group rg-ai-full-stack-demo --name gen-ai-ik-demo  --output table

az webapp show --resource-group rg-ai-full-stack-demo --name gen-ai-ik-demo --query state

az containerapp logs show --name gen-ai-ik-demo --resource-group rg-ai-full-stack-demo --type console.

az containerapp logs show -n gen-ai-ik-demo  -g rg-ai-full-stack-demo 
Fetch the past 20 lines of logs from an app and return

nslookup  gen-ai-ik-demo.azurewebsites.net


az webapp identity assign --resource-group  rg-ai-full-stack-demo --name gen-ai-ik-demo  --query principalId --output tsv
3515293d-8884-46b3-aa50-be8283ef844c  <principal-id>

az acr show --name acraikickdemo --resource-group rg-ai-full-stack-demo <registry-resource-id>

az role assignment create --assignee 3515293d-8884-46b3-aa50-be8283ef844c   --scope /subscriptions/14ba3127-28a5-46cd-bc56-093a8ea256fc/resourceGroups/rg-ai-full-stack-demo/providers/Microsoft.ContainerRegistry/registries/acraikickdemo --role "AcrPull"