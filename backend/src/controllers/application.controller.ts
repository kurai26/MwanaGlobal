import { Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types';

export const createApplication = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { opportunityId } = req.params;
    const userId = req.user!.userId;

    const opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
    if (!opportunity) throw new AppError('Opportunity not found', 404);

    const application = await prisma.application.upsert({
      where: { userId_opportunityId: { userId, opportunityId } },
      update: { status: 'APPLIED', appliedAt: new Date() },
      create: { userId, opportunityId, status: 'APPLIED', appliedAt: new Date() },
    });

    res.json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        opportunity: {
          select: {
            id: true, title: true, institution: true, type: true,
            country: true, applicationDeadline: true, logoUrl: true,
            directApplyUrl: true, agentName: true, agentUrl: true, agentContact: true,
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.json({ success: true, data: { applications } });
  } catch (err) {
    next(err);
  }
};
