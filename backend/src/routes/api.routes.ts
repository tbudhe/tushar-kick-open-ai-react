import { Router } from 'express';
import {
	applyController,
	getApplicationsController,
	updateApplicationController,
} from '../controllers/application.controller';
import { getApiHealth, getSystemHealth } from '../controllers/health.controller';
import { parseResumeController, tailorResumeController } from '../controllers/resume.controller';
import {
	ragListBenchmarkRunsController,
	ragRetrieveController,
	ragSaveBenchmarkRunController,
	ragUpsertController,
} from '../controllers/rag.controller';
import { resumeUpload } from '../middlewares/resume-upload';
import { contactFormRateLimit } from '../middlewares/contact-form-rate-limit';
import { getJobsController, searchJobsController } from '../controllers/job.controller';
import { getDbStatus, getMenu } from '../controllers/system.controller';
import { scoreJobsController } from '../controllers/match-score.controller';
import { getProfileController, updateProfileController } from '../controllers/profile.controller';
import {
	requestContactVerificationController,
	sendContactMessageController,
	verifyContactCodeController,
} from '../controllers/contact.controller';
import { submitContactFormController } from '../controllers/contact-form.controller';

const apiRouter = Router();

apiRouter.get('/health', getApiHealth);
apiRouter.get('/system-health', getSystemHealth);
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
apiRouter.post('/jobs/score', scoreJobsController);
apiRouter.get('/profile', getProfileController);
apiRouter.put('/profile', updateProfileController);
apiRouter.post('/contact/request-code', contactFormRateLimit, requestContactVerificationController);
apiRouter.post('/contact/verify-code', verifyContactCodeController);
apiRouter.post('/contact/send-message', sendContactMessageController);
apiRouter.post('/contact-form', contactFormRateLimit, submitContactFormController);

export default apiRouter;
