import { Router } from 'express';
import { body } from 'express-validator';
import * as auth from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';

const router = Router();

router.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('role').isIn(['STUDENT', 'PARENT', 'SCHOOL_COUNSELOR', 'SCOUT', 'UNIVERSITY_REP']),
  validateRequest,
  auth.register
);

router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validateRequest,
  auth.login
);

router.get('/verify-email', auth.verifyEmail);

router.post('/forgot-password',
  body('email').isEmail().normalizeEmail(),
  validateRequest,
  auth.forgotPassword
);

router.post('/reset-password',
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }),
  validateRequest,
  auth.resetPassword
);

router.post('/refresh-token', auth.refreshToken);
router.post('/logout', auth.logout);
router.get('/me', authenticate, auth.getMe);

export default router;
