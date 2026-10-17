import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

const tierRank = { BRONZE: 0, SILVER: 1, GOLD: 2 } as const;

export function requireTier(minTier: 'BRONZE' | 'SILVER' | 'GOLD') {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userTier = (req.user?.subscriptionTier ?? 'BRONZE') as keyof typeof tierRank;
    if (tierRank[userTier] >= tierRank[minTier]) return next();
    res.status(403).json({ success: false, message: `This feature requires ${minTier} or higher subscription.` });
  };
}
