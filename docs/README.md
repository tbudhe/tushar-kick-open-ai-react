# AI Project with React and Node.js

[![Build and push Docker image](https://github.com/tbudhe/tushar-kick-open-ai-react/actions/workflows/docker-build-push.yml/badge.svg)](https://github.com/tbudhe/tushar-kick-open-ai-react/actions/workflows/docker-build-push.yml)

This project is an AI-powered web application built with **React** for the frontend and **Node.js (Express, TypeScript)** for the backend. The React app is served directly from the Node.js server (`server.ts`), allowing seamless integration of API endpoints and static frontend assets.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Available Scripts](#available-scripts)
- [Railway Deployment](#railway-deployment)
- [Docker Instructions](#docker-instructions)
- [Debugging and Logs](#debugging-and-logs)

---

## Features

- **AI-driven features** with ML practice components
- **React frontend** served from Node.js Express backend
- **REST API endpoints** for dynamic data
- **Production-ready**: Single server for both frontend and backend
- **Dockerized**: Build and deploy using Docker
- **Railway-ready**: Deploy with Docker and managed service variables
- **ML Learning Hub**: Includes visual search, decision trees, regression, and optimization algorithms

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** (v8 or higher)
- **Docker** (for containerization)

---

## Local Development

### 1. Install Dependencies
```sh
npm install
```

### 2. Run Development Server
```sh
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

### 3. Run Production Server
```sh
npm run serve
```
This builds frontend + server and starts the compiled Node server.

### 4. Validate Database Connection
```sh
npm run test:db
```

---

## Documentation Links

Use the finalized runbook:

- [Railway Deployment Guide](./RAILWAY_DEPLOYMENT.md)

Day-1 handoff docs:

- [Day 1 Completion](./DAY1_COMPLETION.md)
- [Day 1 Verification](./DAY1_VERIFICATION.md)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the compiled production server (`node dist/server.js`).

Build first with `npm run build && npm run build:server`.

### `npm run dev`

Runs the React development server.

### `npm run serve`

Builds frontend + server and starts the compiled production server.

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

### Build Docker Image

#### Standard build
```sh
docker build -t tbudhe-ik-ai-agent .
```

### Run Docker Container Locally

```sh
docker run -p 3000:3000 tbudhe-ik-ai-agent
```

Access at [http://localhost:3000](http://localhost:3000)

---

## Railway Deployment

Primary deployment target is Railway.

Live URL:

- `https://gen-ai-ik-demo-production-0c69.up.railway.app`

Primary endpoints:

- `/`
- `/health`
- `/heartbeat`
- `/api/health`
- `/api/menu`

Detailed runbook:

- `docs/RAILWAY_DEPLOYMENT.md`

## Debugging and Logs

### Railway logs
```sh
railway logs --latest --lines 200
```

### Railway deployments
```sh
railway deployment list
```

### Health validation
```sh
curl https://gen-ai-ik-demo-production-0c69.up.railway.app/health
curl https://gen-ai-ik-demo-production-0c69.up.railway.app/heartbeat
curl https://gen-ai-ik-demo-production-0c69.up.railway.app/api/health
```

---

## Project Structure

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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is private and maintained by Tushar Budhe.

---

## Useful Links

- [Railway App](https://gen-ai-ik-demo-production-0c69.up.railway.app)
- [Railway](https://railway.app)
- [Docker Hub](https://hub.docker.com)
- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)


