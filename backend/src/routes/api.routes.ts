import { Router } from 'express';
import { getApiHealth } from '../controllers/health.controller';
import { parseResumeController } from '../controllers/resume.controller';
import { resumeUpload } from '../middlewares/resume-upload';
import { getDbStatus, getMenu } from '../controllers/system.controller';

const apiRouter = Router();

apiRouter.get('/health', getApiHealth);
apiRouter.get('/menu', getMenu);
apiRouter.get('/db-status', getDbStatus);
apiRouter.post('/parse-resume', resumeUpload.single('resumeFile'), parseResumeController);

export default apiRouter;
