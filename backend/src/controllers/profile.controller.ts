import { Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../types';
import { AppError } from '../middleware/error.middleware';
import { calculateAcademicScore, calculateOverallScore } from '../services/scoring.service';

export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user!.userId },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        oLevelResults: true,
        aLevelResults: true,
        careerInterests: true,
        leadershipActivities: true,
        sportProfiles: { include: { videos: true } },
        culturalActivities: true,
        documents: true,
        recommendations: true,
      },
    });
    if (!profile) throw new AppError('Profile not found', 404);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

export const updatePersonalInfo = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { dateOfBirth, gender, country, city, nationality, school, graduationYear, biography } = req.body;

    const profile = await prisma.studentProfile.update({
      where: { userId: req.user!.userId },
      data: { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, gender, country, city, nationality, school, graduationYear, biography },
    });

    res.json({ success: true, data: profile, message: 'Personal information updated' });
  } catch (err) {
    next(err);
  }
};

export const updateProfilePhoto = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { photoUrl, publicId } = req.body;
    const profile = await prisma.studentProfile.update({
      where: { userId: req.user!.userId },
      data: { profilePhotoUrl: photoUrl, profilePhotoPublicId: publicId },
    });
    res.json({ success: true, data: profile, message: 'Profile photo updated' });
  } catch (err) {
    next(err);
  }
};

// O Level Results
export const upsertOLevelResults = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { results } = req.body as { results: Array<{ subject: string; grade: string; year?: number; examBoard?: string }> };
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Profile not found', 404);

    await prisma.oLevelResult.deleteMany({ where: { profileId: profile.id } });
    await prisma.oLevelResult.createMany({
      data: results.map(r => ({ ...r, profileId: profile.id })),
    });

    const updated = await recalculateScores(profile.id);
    res.json({ success: true, data: updated, message: 'O Level results saved' });
  } catch (err) {
    next(err);
  }
};

export const upsertALevelResults = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { results } = req.body as { results: Array<{ subject: string; grade: string; year?: number; examBoard?: string }> };
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Profile not found', 404);

    await prisma.aLevelResult.deleteMany({ where: { profileId: profile.id } });
    await prisma.aLevelResult.createMany({
      data: results.map(r => ({ ...r, profileId: profile.id })),
    });

    const updated = await recalculateScores(profile.id);
    res.json({ success: true, data: updated, message: 'A Level results saved' });
  } catch (err) {
    next(err);
  }
};

// Career Interests
export const updateCareerInterests = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { interests } = req.body as { interests: string[] };
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Profile not found', 404);

    await prisma.careerInterest.deleteMany({ where: { profileId: profile.id } });
    await prisma.careerInterest.createMany({
      data: interests.map(interest => ({ interest, profileId: profile.id })),
    });

    res.json({ success: true, message: 'Career interests updated' });
  } catch (err) {
    next(err);
  }
};

// Leadership
export const addLeadershipActivity = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, yearsActive, startYear, endYear, isCurrentRole } = req.body;
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Profile not found', 404);

    const activity = await prisma.leadershipActivity.create({
      data: { profileId: profile.id, title, description, yearsActive, startYear, endYear, isCurrentRole },
    });

    await recalculateScores(profile.id);
    res.status(201).json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
};

export const updateLeadershipActivity = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Profile not found', 404);

    const activity = await prisma.leadershipActivity.update({
      where: { id, profileId: profile.id },
      data: req.body,
    });
    res.json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
};

export const deleteLeadershipActivity = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Profile not found', 404);

    await prisma.leadershipActivity.delete({ where: { id, profileId: profile.id } });
    res.json({ success: true, message: 'Activity deleted' });
  } catch (err) {
    next(err);
  }
};

// Sports
export const addSportProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sportName, position, competitionLevel, achievements, statistics, yearsPlayed, startYear } = req.body;
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Profile not found', 404);

    const sport = await prisma.sportProfile.create({
      data: { profileId: profile.id, sportName, position, competitionLevel, achievements, statistics, yearsPlayed, startYear },
    });
    await recalculateScores(profile.id);
    res.status(201).json({ success: true, data: sport });
  } catch (err) {
    next(err);
  }
};

export const updateSportProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Profile not found', 404);

    const sport = await prisma.sportProfile.update({
      where: { id, profileId: profile.id },
      data: req.body,
    });
    res.json({ success: true, data: sport });
  } catch (err) {
    next(err);
  }
};

export const deleteSportProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Profile not found', 404);

    await prisma.sportProfile.delete({ where: { id, profileId: profile.id } });
    res.json({ success: true, message: 'Sport profile deleted' });
  } catch (err) {
    next(err);
  }
};

// Cultural
export const addCulturalActivity = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Profile not found', 404);

    const activity = await prisma.culturalActivity.create({
      data: { profileId: profile.id, ...req.body },
    });
    res.status(201).json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
};

export const deleteCulturalActivity = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Profile not found', 404);

    await prisma.culturalActivity.delete({ where: { id, profileId: profile.id } });
    res.json({ success: true, message: 'Cultural activity deleted' });
  } catch (err) {
    next(err);
  }
};

// Documents
export const addDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, title, fileUrl, publicId, mimeType, fileSize } = req.body;
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Profile not found', 404);

    const doc = await prisma.document.create({
      data: { profileId: profile.id, type, title, fileUrl, publicId, mimeType, fileSize },
    });
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });
    if (!profile) throw new AppError('Profile not found', 404);

    await prisma.document.delete({ where: { id, profileId: profile.id } });
    res.json({ success: true, message: 'Document deleted' });
  } catch (err) {
    next(err);
  }
};

// Public profile view
export const getPublicProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { profileId } = req.params;
    const profile = await prisma.studentProfile.findUnique({
      where: { id: profileId, isPublic: true },
      include: {
        user: { select: { firstName: true, lastName: true } },
        oLevelResults: true,
        aLevelResults: true,
        careerInterests: true,
        leadershipActivities: true,
        sportProfiles: { include: { videos: { select: { id: true, title: true, thumbnailUrl: true, duration: true } } } },
        culturalActivities: true,
        documents: { where: { type: { not: 'TRANSCRIPT' } } },
      },
    });

    if (!profile) throw new AppError('Profile not found', 404);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

async function recalculateScores(profileId: string) {
  const profile = await prisma.studentProfile.findUnique({
    where: { id: profileId },
    include: { oLevelResults: true, aLevelResults: true, leadershipActivities: true, sportProfiles: true },
  });

  if (!profile) return null;

  const academicScore = calculateAcademicScore(profile.oLevelResults, profile.aLevelResults);
  const overallScore = calculateOverallScore(profile);

  return prisma.studentProfile.update({
    where: { id: profileId },
    data: {
      academicScore: academicScore.score,
      distinctions: academicScore.distinctions,
      stemStrength: academicScore.stemStrength,
      businessStrength: academicScore.businessStrength,
      humanitiesStrength: academicScore.humanitiesStrength,
      overallScore,
    },
  });
}
