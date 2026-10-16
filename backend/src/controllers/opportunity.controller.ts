import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types';
import { calculateOpportunityFitScore, calculateLeadershipScore, calculateSportsScore } from '../services/scoring.service';

export const getOpportunities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, country, page = '1', pageSize = '12', search, funded } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);

    const where: Record<string, unknown> = { isActive: true };
    if (type) where.type = type;
    if (country) where.country = country;
    if (funded === 'true') where.isFunded = true;
    if (search) where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { institution: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];

    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        skip,
        take: parseInt(pageSize as string),
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        select: {
          id: true, type: true, title: true, institution: true, country: true,
          logoUrl: true, isFunded: true, fundingAmount: true, applicationDeadline: true,
          isFeatured: true, eligibleCountries: true, viewCount: true,
        },
      }),
      prisma.opportunity.count({ where }),
    ]);

    res.json({
      success: true,
      data: opportunities,
      pagination: {
        total,
        page: parseInt(page as string),
        pageSize: parseInt(pageSize as string),
        totalPages: Math.ceil(total / parseInt(pageSize as string)),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getOpportunityById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: { university: true, _count: { select: { applications: true } } },
    });
    if (!opportunity) throw new AppError('Opportunity not found', 404);

    await prisma.opportunity.update({ where: { id }, data: { viewCount: { increment: 1 } } });
    res.json({ success: true, data: opportunity });
  } catch (err) {
    next(err);
  }
};

export const getMyMatches = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user!.userId },
      include: {
        oLevelResults: true,
        aLevelResults: true,
        careerInterests: true,
        leadershipActivities: true,
        sportProfiles: true,
      },
    });

    if (!profile) throw new AppError('Student profile not found', 404);

    const opportunities = await prisma.opportunity.findMany({ where: { isActive: true } });

    const leadershipScore = calculateLeadershipScore(profile.leadershipActivities);
    const sportsScore = calculateSportsScore(profile.sportProfiles);

    const studentData = {
      academicScore: profile.academicScore,
      leadershipScore,
      sportsScore,
      careerInterests: profile.careerInterests.map(c => c.interest),
      country: profile.country,
      oLevelResults: profile.oLevelResults,
      aLevelResults: profile.aLevelResults,
      sportProfiles: profile.sportProfiles,
      stemStrength: profile.stemStrength,
      businessStrength: profile.businessStrength,
      humanitiesStrength: profile.humanitiesStrength,
    };

    const matches = opportunities
      .map(opp => {
        const { fitScore, breakdown } = calculateOpportunityFitScore(studentData, {
          type: opp.type,
          eligibleCountries: opp.eligibleCountries,
          requiredSubjects: opp.requiredSubjects,
          academicWeight: opp.academicWeight,
          leadershipWeight: opp.leadershipWeight,
          sportsWeight: opp.sportsWeight,
          stemRequired: opp.stemRequired,
          sportsRequired: opp.sportsRequired,
        });
        return { opportunity: opp, fitScore, breakdown };
      })
      .filter(m => m.fitScore >= 30)
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, 20);

    // Persist matches
    await Promise.all(
      matches.map(m =>
        prisma.opportunityMatch.upsert({
          where: { studentId_opportunityId: { studentId: profile.id, opportunityId: m.opportunity.id } },
          update: { fitScore: m.fitScore, breakdown: m.breakdown, leadershipScore, sportsScore },
          create: {
            studentId: profile.id,
            opportunityId: m.opportunity.id,
            fitScore: m.fitScore,
            breakdown: m.breakdown,
            academicScore: profile.academicScore,
            leadershipScore,
            sportsScore,
          },
        })
      )
    );

    res.json({ success: true, data: matches });
  } catch (err) {
    next(err);
  }
};

export const saveOpportunity = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.savedOpportunity.upsert({
      where: { userId_opportunityId: { userId: req.user!.userId, opportunityId: id } },
      update: {},
      create: { userId: req.user!.userId, opportunityId: id },
    });
    res.json({ success: true, message: 'Opportunity saved' });
  } catch (err) {
    next(err);
  }
};

export const unsaveOpportunity = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.savedOpportunity.delete({
      where: { userId_opportunityId: { userId: req.user!.userId, opportunityId: id } },
    });
    res.json({ success: true, message: 'Opportunity removed from saved' });
  } catch (err) {
    next(err);
  }
};

export const getSavedOpportunities = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const saved = await prisma.savedOpportunity.findMany({
      where: { userId: req.user!.userId },
      include: { opportunity: true },
      orderBy: { savedAt: 'desc' },
    });
    res.json({ success: true, data: saved.map(s => s.opportunity) });
  } catch (err) {
    next(err);
  }
};
