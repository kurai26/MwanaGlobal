import { OLevelResult, ALevelResult, SportProfile, LeadershipActivity } from '@prisma/client';

// O Level grade points (ZIMSEC/Cambridge)
const GRADE_POINTS: Record<string, number> = {
  'A*': 9, A: 8, B: 7, C: 6, D: 5, E: 4, F: 3, G: 2, U: 0,
  '1': 9, '2': 8, '3': 7, '4': 6, '5': 5, '6': 4, '7': 3, '8': 2, '9': 0,
};

const STEM_SUBJECTS = ['mathematics', 'physics', 'chemistry', 'biology', 'computer science', 'further mathematics', 'statistics'];
const BUSINESS_SUBJECTS = ['accounts', 'accounting', 'economics', 'business studies', 'commerce', 'business enterprise'];
const HUMANITIES_SUBJECTS = ['history', 'geography', 'literature', 'english', 'religious education', 'sociology'];

const isDistinction = (grade: string): boolean => ['A*', 'A', 'B', '1', '2'].includes(grade.toUpperCase());

export const calculateAcademicScore = (
  oLevel: OLevelResult[],
  aLevel: ALevelResult[]
): { score: number; distinctions: number; stemStrength: number; businessStrength: number; humanitiesStrength: number } => {
  if (oLevel.length === 0 && aLevel.length === 0) {
    return { score: 0, distinctions: 0, stemStrength: 0, businessStrength: 0, humanitiesStrength: 0 };
  }

  // Score O Levels
  const oPoints = oLevel.map(r => GRADE_POINTS[r.grade.toUpperCase()] ?? 0);
  const oAvg = oPoints.length > 0 ? oPoints.reduce((a, b) => a + b, 0) / oPoints.length : 0;
  const oNormalised = (oAvg / 9) * 100;

  // Score A Levels (weighted higher)
  const aPoints = aLevel.map(r => GRADE_POINTS[r.grade.toUpperCase()] ?? 0);
  const aAvg = aPoints.length > 0 ? aPoints.reduce((a, b) => a + b, 0) / aPoints.length : 0;
  const aNormalised = (aAvg / 9) * 100;

  const combinedScore = oLevel.length > 0 && aLevel.length > 0
    ? oNormalised * 0.4 + aNormalised * 0.6
    : oLevel.length > 0 ? oNormalised : aNormalised;

  const distinctions = [...oLevel, ...aLevel].filter(r => isDistinction(r.grade)).length;

  // Subject strength analysis
  const allResults = [...oLevel, ...aLevel];
  const subjectStrength = (subjectList: string[]): number => {
    const matching = allResults.filter(r => subjectList.some(s => r.subject.toLowerCase().includes(s)));
    if (matching.length === 0) return 0;
    const pts = matching.map(r => GRADE_POINTS[r.grade.toUpperCase()] ?? 0);
    return (pts.reduce((a, b) => a + b, 0) / matching.length / 9) * 100;
  };

  return {
    score: Math.round(combinedScore),
    distinctions,
    stemStrength: Math.round(subjectStrength(STEM_SUBJECTS)),
    businessStrength: Math.round(subjectStrength(BUSINESS_SUBJECTS)),
    humanitiesStrength: Math.round(subjectStrength(HUMANITIES_SUBJECTS)),
  };
};

export const calculateLeadershipScore = (activities: LeadershipActivity[]): number => {
  if (activities.length === 0) return 0;
  const weights: Record<string, number> = {
    'Head Boy': 100, 'Head Girl': 100, 'Prefect': 70, 'House Captain': 65,
    'Student Council': 60, 'Club Leader': 50, 'Debate Captain': 55, 'Volunteer Work': 40,
    'Community Leadership': 45,
  };
  const score = activities.reduce((sum, a) => {
    const weight = Object.entries(weights).find(([k]) => a.title.toLowerCase().includes(k.toLowerCase()))?.[1] ?? 35;
    return sum + weight;
  }, 0);
  return Math.min(100, Math.round(score / activities.length));
};

export const calculateSportsScore = (sports: SportProfile[]): number => {
  if (sports.length === 0) return 0;
  const levelPoints: Record<string, number> = {
    INTERNATIONAL: 100, NATIONAL: 80, PROVINCIAL: 60, DISTRICT: 40, SCHOOL: 20,
  };
  const maxLevel = sports.reduce((max, s) => {
    const pts = levelPoints[s.competitionLevel ?? 'SCHOOL'] ?? 20;
    return Math.max(max, pts);
  }, 0);
  return maxLevel;
};

export const calculateOverallScore = (profile: {
  oLevelResults: OLevelResult[];
  aLevelResults: ALevelResult[];
  leadershipActivities: LeadershipActivity[];
  sportProfiles: SportProfile[];
}): number => {
  const { score: academicScore } = calculateAcademicScore(profile.oLevelResults, profile.aLevelResults);
  const leadershipScore = calculateLeadershipScore(profile.leadershipActivities);
  const sportsScore = calculateSportsScore(profile.sportProfiles);

  // Weighted Overall: Academic 50%, Leadership 30%, Sports 20%
  const overall = academicScore * 0.5 + leadershipScore * 0.3 + sportsScore * 0.2;
  return Math.round(overall);
};

// ============================================================
// OPPORTUNITY MATCHING - Weighted Fit Score
// ============================================================
export const calculateOpportunityFitScore = (
  student: {
    academicScore: number | null;
    leadershipScore: number | null;
    sportsScore: number | null;
    careerInterests: string[];
    country: string | null;
    oLevelResults: OLevelResult[];
    aLevelResults: ALevelResult[];
    sportProfiles: SportProfile[];
    stemStrength: number | null;
    businessStrength: number | null;
    humanitiesStrength: number | null;
  },
  opportunity: {
    type: string;
    eligibleCountries: string[];
    requiredSubjects: string[];
    academicWeight: number;
    leadershipWeight: number;
    sportsWeight: number;
    stemRequired: boolean;
    sportsRequired: boolean;
    minAge?: number | null;
    maxAge?: number | null;
  }
): { fitScore: number; breakdown: Record<string, number | string> } => {
  const breakdown: Record<string, number | string> = {};

  // Eligibility check
  if (opportunity.eligibleCountries.length > 0 && student.country) {
    if (!opportunity.eligibleCountries.includes(student.country) && !opportunity.eligibleCountries.includes('ALL')) {
      return { fitScore: 0, breakdown: { reason: 'Country not eligible' } };
    }
  }

  // Academic fit
  const academicFit = (student.academicScore ?? 0) / 100;
  breakdown.academic = Math.round(academicFit * 100);

  // Leadership fit
  const leadershipFit = (student.leadershipScore ?? 0) / 100;
  breakdown.leadership = Math.round(leadershipFit * 100);

  // Sports fit
  const sportsFit = (student.sportsScore ?? 0) / 100;
  breakdown.sports = Math.round(sportsFit * 100);

  // Subject alignment
  let subjectFit = 0.5;
  if (opportunity.requiredSubjects.length > 0) {
    const allSubjects = [...student.oLevelResults, ...student.aLevelResults].map(r => r.subject.toLowerCase());
    const matched = opportunity.requiredSubjects.filter(s => allSubjects.some(a => a.includes(s.toLowerCase())));
    subjectFit = matched.length / opportunity.requiredSubjects.length;
  }
  breakdown.subjects = Math.round(subjectFit * 100);

  // STEM bonus
  if (opportunity.stemRequired && (student.stemStrength ?? 0) > 60) {
    breakdown.stemBonus = 10;
  }

  // Weighted composite
  const totalWeight = opportunity.academicWeight + opportunity.leadershipWeight + opportunity.sportsWeight;
  const weightedScore =
    (academicFit * opportunity.academicWeight +
      leadershipFit * opportunity.leadershipWeight +
      sportsFit * opportunity.sportsWeight) / totalWeight;

  const subjectBonus = subjectFit * 0.1;
  const stemBonus = opportunity.stemRequired && (student.stemStrength ?? 0) > 60 ? 0.05 : 0;

  const fitScore = Math.min(100, Math.round((weightedScore + subjectBonus + stemBonus) * 100));

  return { fitScore, breakdown };
};
