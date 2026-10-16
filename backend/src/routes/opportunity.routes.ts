import { Router } from 'express';
import * as opp from '../controllers/opportunity.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', opp.getOpportunities);
router.get('/:id', opp.getOpportunityById);

router.use(authenticate);
router.get('/my/matches', authorize('STUDENT'), opp.getMyMatches);
router.get('/my/saved', opp.getSavedOpportunities);
router.post('/:id/save', opp.saveOpportunity);
router.delete('/:id/save', opp.unsaveOpportunity);

export default router;
