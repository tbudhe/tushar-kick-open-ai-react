import { Router } from 'express';
import { getHealth, getHeartbeat } from '../controllers/health.controller';

const publicRouter = Router();

publicRouter.get('/health', getHealth);
publicRouter.get('/heartbeat', getHeartbeat);

export default publicRouter;
