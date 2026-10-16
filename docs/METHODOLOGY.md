# Mwana Global — Methodology Document

**Version:** 1.0  
**Date:** October 2024  
**Authors:** Mwana Global Engineering Team

---

## 1. Overview

Mwana Global is a SaaS platform that profiles African students holistically and uses a proprietary **Opportunity Fit Score (OFS)** algorithm to intelligently match them to opportunities. This document describes the methodology behind the scoring, matching, and profiling systems.

---

## 2. Student Profile System

### 2.1 Profile Dimensions

A Mwana Global profile captures five core dimensions:

| Dimension | Weight in OFS | Description |
|-----------|:-------------:|-------------|
| Academic | 50% (default) | O Level & A Level results, distinctions, subject strengths |
| Leadership | 30% (default) | Roles, impact level, organisational scope |
| Sports | 20% (default) | Athletic achievements, level of competition, active status |
| Cultural | Qualitative | Arts, music, drama, debate — contextual bonus |
| Documents | Qualitative | Transcripts, recommendations — verification signal |

**Note:** Weights are configurable per opportunity. A sports academy may weight Sports 70% / Academic 30%.

---

## 3. Academic Score Calculation

### 3.1 Grade Normalisation

We normalise ZIMSEC and Cambridge International results to a 0–100 scale using the following grade-to-points mapping:

| Grade | Points | Interpretation |
|-------|:------:|----------------|
| A* | 9 | Exceptional |
| A | 8 | Distinction |
| B | 7 | Merit |
| C | 6 | Credit |
| D | 5 | Pass |
| E | 4 | Near pass |
| U | 0 | Ungraded |

**Formula:**

```
rawScore = sum(gradePoints) / (count × 9) × 100
```

### 3.2 Distinction Bonus

Students with distinctions receive a bonus to reward excellence:

```
distinctionCount = count(grades where grade IN ['A*', 'A'])
distinctionBonus = min(distinctionCount × 2, 20)  // capped at 20 points
```

### 3.3 Subject Strength Analysis

We categorise subjects into three buckets and calculate subject-area scores:

**STEM:** Mathematics, Biology, Chemistry, Physics, Computer Science, Agriculture  
**Business:** Accounts, Business Studies, Economics  
**Humanities:** English Language, English Literature, History, Geography, Shona, Ndebele, Religious Education, Art, Music

A subject strength score is the average normalised grade within each bucket.

### 3.4 Final Academic Score

```
academicScore = min(
  (rawScore × 0.7) + (distinctionBonus × 0.3),
  100
)
```

---

## 4. Leadership Score Calculation

### 4.1 Impact Level Points

Each leadership activity is assigned base points by impact level:

| Level | Base Points |
|-------|:-----------:|
| SCHOOL | 10 |
| DISTRICT | 20 |
| NATIONAL | 35 |
| INTERNATIONAL | 50 |

### 4.2 Activity Count Bonus

Multiple activities signal breadth of involvement:

```
activityBonus = min((activityCount - 1) × 5, 25)
```

### 4.3 Final Leadership Score

```
leadershipScore = min(
  maxImpactPoints + activityBonus,
  100
)
```

---

## 5. Sports Score Calculation

### 5.1 Level Points

| Level | Points |
|-------|:------:|
| SCHOOL | 15 |
| DISTRICT | 25 |
| PROVINCIAL | 40 |
| NATIONAL | 55 |
| INTERNATIONAL | 75 |

### 5.2 Active Sport Bonus

An actively competing student receives a 10-point bonus per active sport (max 20).

### 5.3 Final Sports Score

```
sportsScore = min(maxLevelPoints + activeBonus, 100)
```

---

## 6. Opportunity Fit Score (OFS)

The OFS is a weighted composite score representing how well a student's profile matches a specific opportunity.

### 6.1 Default Weights

```
academicWeight    = 0.50
leadershipWeight  = 0.30
sportsWeight      = 0.20
```

These weights are configurable per opportunity type and instance.

### 6.2 Base Fit Score

```
baseFitScore = (
  (studentAcademicScore  × academicWeight) +
  (studentLeadershipScore × leadershipWeight) +
  (studentSportsScore    × sportsWeight)
)
```

### 6.3 Subject Alignment Bonus (University Opportunities)

When an opportunity has required subjects (e.g., Engineering requires Mathematics and Physics), we calculate alignment:

```
requiredSubjects = opportunity.requirements.subjects
alignedStrength  = average(subjectStrengthScores for subjects in requiredSubjects)
alignmentBonus   = alignedStrength × 0.10  // max 10 point bonus
```

### 6.4 STEM Bonus

For STEM-flagged opportunities:

```
if opportunity.isStemFocused:
  stemBonus = studentStemStrength × 0.05  // max 5 points
```

### 6.5 Country Eligibility Filter

Opportunities with `countryRestrictions` are only matched to eligible students. Mismatched country results in a `fitScore = 0`.

### 6.6 Final OFS

```
fitScore = min(
  baseFitScore + alignmentBonus + stemBonus,
  100
)
```

---

## 7. Matching Algorithm

### 7.1 Process

1. Retrieve all active, non-expired opportunities
2. For each opportunity, call `calculateOpportunityFitScore(student, opportunity)`
3. Apply country eligibility filter
4. Sort opportunities by `fitScore` descending
5. Persist top results to `OpportunityMatch` table with score breakdown
6. Return ranked list to the student

### 7.2 Score Breakdown Storage

Each match record stores the component scores for transparency:

```json
{
  "fitScore": 78.4,
  "breakdown": {
    "academic": 81.2,
    "leadership": 72.0,
    "sports": 60.0,
    "alignmentBonus": 4.2
  }
}
```

### 7.3 Match Refresh Policy

- Matches are recalculated whenever a student updates their profile (any section)
- Matches are recalculated nightly via cron job for opportunities with changed deadlines
- Students can manually trigger a match refresh

---

## 8. Scoring Fairness Principles

1. **No demographic bias:** Scores are based purely on academic achievements, activities, and measurable metrics — not gender, tribe, or socioeconomic background
2. **Transparency:** Every score shows a breakdown so students understand exactly why they received a match
3. **Holistic evaluation:** A student with a low academic score can still achieve a high OFS through exceptional leadership and sports performance
4. **Grade system parity:** ZIMSEC and Cambridge grades are normalised identically, ensuring Zimbabwean students are not disadvantaged

---

## 9. Privacy & Data Protection

- **Students' full profiles are private** by default
- Universities and scouts can view **summary scores and subject strengths** — not granular grade-by-grade data — until a student explicitly shares their full profile
- **Contact flow:** Scouts and university reps may only contact a student's parent/guardian initially — never the student directly — protecting minors
- Sensitive documents (transcripts, IDs) are stored encrypted on Cloudinary with access controls

---

## 10. Algorithm Versioning

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Oct 2024 | Initial release — O Level scoring, base OFS, country filter |
| 1.1 | Planned | A Level integration into academic score |
| 1.2 | Planned | Cultural activity scoring |
| 2.0 | Planned | ML-based opportunity recommendation layer |

---

*This document is a living reference. The engineering team updates it with every significant algorithm change.*
