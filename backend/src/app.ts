import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import apiRouter from './routes/api.routes';
import publicRouter from './routes/public.routes';
import { errorHandler } from './middlewares/error-handler';

const NODE_ENV = process.env.NODE_ENV || 'development';

function resolveBuildArtifacts() {
  const candidateBuildPaths = [
    path.join(__dirname, '../../dist/build'),
    path.join(__dirname, '../../dist'),
    path.join(__dirname, '../dist/build'),
    path.join(__dirname, '../dist'),
    path.join(process.cwd(), 'dist', 'build'),
    path.join(process.cwd(), 'dist'),
    process.cwd(),
  ];

  let buildPath: string | undefined;
  let indexPath: string | undefined;

  for (const candidate of candidateBuildPaths) {
    const candidateIndex = path.join(candidate, 'index.html');
    if (fs.existsSync(candidateIndex)) {
      buildPath = candidate;
      indexPath = candidateIndex;
      break;
    }

    const nestedIndex = path.join(candidate, 'build', 'index.html');
    if (fs.existsSync(nestedIndex)) {
      buildPath = path.join(candidate, 'build');
      indexPath = nestedIndex;
      break;
    }
  }

  if (!buildPath || !indexPath) {
    buildPath = path.join(process.cwd(), 'dist', 'build');
    indexPath = path.join(buildPath, 'index.html');
  }

  return {
    buildPath,
    indexPath,
    indexExists: fs.existsSync(indexPath),
    candidateBuildPaths,
  };
}

function resolveOpenApiSpecPath() {
  const candidates = [
    path.join(process.cwd(), 'backend', 'openapi', 'swagger.json'),
    path.join(__dirname, '../openapi/swagger.json'),
    path.join(__dirname, '../../backend/openapi/swagger.json'),
    path.join(__dirname, '../../../backend/openapi/swagger.json'),
  ];

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  return found || null;
}

function loadOpenApiSpec() {
  const specPath = resolveOpenApiSpecPath();
  if (!specPath) {
    return null;
  }

  try {
    const raw = fs.readFileSync(specPath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('[OPENAPI] Failed to load swagger.json:', error);
    return null;
  }
}

export function createApp() {
  const app = express();
  const openApiSpec = loadOpenApiSpec();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(publicRouter);
  app.use('/api', apiRouter);

  app.get('/api/openapi.json', (_req, res) => {
    if (!openApiSpec) {
      return res.status(404).json({
        error: 'OpenAPI spec not found. Run: npm run build:contract',
      });
    }

    return res.status(200).json(openApiSpec);
  });

  if (openApiSpec) {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
  } else {
    app.get('/api/docs', (_req, res) => {
      res.status(404).json({
        error: 'Swagger docs unavailable. Generate spec with: npm run build:contract',
      });
    });
  }

  const { buildPath, indexPath, indexExists, candidateBuildPaths } = resolveBuildArtifacts();

  if (NODE_ENV !== 'production') {
    console.log(`[SERVER] Candidate build paths: ${candidateBuildPaths.join(', ')}`);
    console.log(`[SERVER] Using buildPath: ${buildPath}`);
    console.log(`[SERVER] index.html exists: ${indexExists} -> ${indexPath}`);
  }

  app.use(express.static(buildPath));

  app.use((_req, res) => {
    if (indexExists) {
      return res.sendFile(indexPath);
    }

    return res.status(404).send(
      `index.html not found. Looked at: ${candidateBuildPaths.join(', ')}`,
    );
  });

  app.use(errorHandler);

  return app;
}
