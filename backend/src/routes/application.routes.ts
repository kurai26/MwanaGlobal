import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { createApplication, getMyApplications } from '../controllers/application.controller';

const router = Router();

router.use(authenticate);
router.post('/:opportunityId', createApplication);
router.get('/my', getMyApplications);

export default router;
