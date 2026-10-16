import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errMap: Record<string, string> = {};
    errors.array().forEach(err => {
      if ('path' in err) errMap[err.path as string] = err.msg;
    });
    res.status(400).json({ success: false, message: 'Validation failed', errors: errMap });
    return;
  }
  next();
};
