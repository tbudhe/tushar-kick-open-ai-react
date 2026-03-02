import { Router } from 'express';
import {
	applyController,
	getApplicationsController,
	updateApplicationController,
} from '../controllers/application.controller';
import { getApiHealth } from '../controllers/health.controller';
import { parseResumeController, tailorResumeController } from '../controllers/resume.controller';
import {
	ragListBenchmarkRunsController,
	ragRetrieveController,
	ragSaveBenchmarkRunController,
	ragUpsertController,
} from '../controllers/rag.controller';
import { resumeUpload } from '../middlewares/resume-upload';
import { getJobsController, searchJobsController } from '../controllers/job.controller';
import { getDbStatus, getMenu } from '../controllers/system.controller';

const apiRouter = Router();

apiRouter.get('/health', getApiHealth);
apiRouter.get('/menu', getMenu);
apiRouter.get('/db-status', getDbStatus);
apiRouter.post('/parse-resume', resumeUpload.single('resumeFile'), parseResumeController);
apiRouter.post('/tailor-resume', tailorResumeController);
apiRouter.post('/rag/upsert', ragUpsertController);
apiRouter.post('/rag/retrieve', ragRetrieveController);
apiRouter.post('/rag/benchmark-runs', ragSaveBenchmarkRunController);
apiRouter.get('/rag/benchmark-runs', ragListBenchmarkRunsController);
apiRouter.post('/apply', applyController);
apiRouter.get('/applications', getApplicationsController);
apiRouter.patch('/applications/:id', updateApplicationController);
apiRouter.post('/search-jobs', searchJobsController);
apiRouter.get('/jobs', getJobsController);

export default apiRouter;
