import { Router } from 'express';
import * as profile from '../controllers/profile.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('STUDENT'));

router.get('/', profile.getMyProfile);
router.patch('/personal', profile.updatePersonalInfo);
router.patch('/photo', profile.updateProfilePhoto);
router.put('/o-level', profile.upsertOLevelResults);
router.put('/a-level', profile.upsertALevelResults);
router.put('/career-interests', profile.updateCareerInterests);

router.post('/leadership', profile.addLeadershipActivity);
router.patch('/leadership/:id', profile.updateLeadershipActivity);
router.delete('/leadership/:id', profile.deleteLeadershipActivity);

router.post('/sports', profile.addSportProfile);
router.patch('/sports/:id', profile.updateSportProfile);
router.delete('/sports/:id', profile.deleteSportProfile);

router.post('/cultural', profile.addCulturalActivity);
router.delete('/cultural/:id', profile.deleteCulturalActivity);

router.post('/documents', profile.addDocument);
router.delete('/documents/:id', profile.deleteDocument);

export default router;
