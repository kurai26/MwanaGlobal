# Mwana Global — Quality Assurance Document

**Version:** 1.0  
**Date:** October 2024  
**Review Cycle:** Quarterly  
**Status:** Active

---

## 1. Purpose

This document defines the quality assurance standards, testing strategy, and release criteria for the Mwana Global platform. It is intended for engineers, QA testers, and product reviewers.

---

## 2. Quality Pillars

| Pillar | Description | Target |
|--------|-------------|--------|
| Correctness | Features work as specified | 0 critical bugs in production |
| Security | No exploitable vulnerabilities | OWASP Top 10 compliance |
| Performance | Pages load fast | P95 < 2s, API < 500ms |
| Reliability | System stays up | 99.9% uptime |
| Accessibility | Usable by all students | WCAG 2.1 AA |
| Data Integrity | Scores are accurate | Scoring unit tests pass |

---

## 3. Testing Strategy

### 3.1 Unit Tests — Backend

**Target Coverage: ≥ 80% of service layer**

| Module | Tests Required |
|--------|----------------|
| `scoring.service.ts` | Grade normalisation, OFS calculation, all edge cases |
| `auth.controller.ts` | Registration validation, login, token refresh |
| `jwt.utils.ts` | Token generation and expiry |
| `email.utils.ts` | Template rendering |

**Critical scoring test cases:**

```typescript
// Grade normalisation
expect(gradeToPoints('A*')).toBe(9)
expect(gradeToPoints('C')).toBe(6)
expect(gradeToPoints('U')).toBe(0)

// Distinction bonus capped at 20
expect(calculateAcademicScore({ oLevel: 10 'A' grades })).toHaveProperty('academicScore', 100)

// OFS default weights
expect(calculateOFS(student, opportunity)).toEqual({
  fitScore: expect.any(Number),
  breakdown: { academic: ..., leadership: ..., sports: ... }
})

// Country filter
expect(calculateOFS(zimbabweStudent, ugandaOnlyOpportunity)).toHaveProperty('fitScore', 0)
```

### 3.2 Integration Tests — API Endpoints

| Endpoint | Test Scenarios |
|----------|----------------|
| `POST /auth/register` | Valid registration, duplicate email (P2002), missing fields |
| `POST /auth/login` | Correct credentials, wrong password, unverified email |
| `GET /auth/verify-email` | Valid token, expired token, used token |
| `GET /profile` | Authenticated, unauthenticated (401) |
| `PUT /profile/o-level` | Valid grades, invalid grade (400), exceeds 12 subjects |
| `GET /opportunities/my/matches` | Returns ranked list, empty when no profile |
| `POST /opportunities/:id/save` | Save new, save duplicate (idempotent) |

### 3.3 E2E Tests — User Journeys

**Priority flows tested with Playwright:**

1. **Student Registration Flow**
   - Navigate to /auth/register
   - Fill all required fields
   - Select STUDENT role
   - Submit → see email confirmation screen
   - Verify email link → redirect to login

2. **Complete Profile Flow**
   - Login with verified account
   - Navigate to dashboard/profile
   - Complete Personal Info section
   - Add 8 O Level results
   - Add 1 leadership activity
   - Verify profile header shows updated score

3. **Opportunity Match Flow**
   - Login with complete profile
   - Navigate to dashboard/matches
   - Verify matches are returned
   - Verify top match has highest fitScore
   - Save an opportunity → verify in saved list

4. **Score Calculation Accuracy**
   - Seed test student with known grades (8 A's, 2 B's)
   - Calculate expected academic score manually
   - Call scoring service
   - Assert result equals expected value ± 0.01

---

## 4. Security Testing Checklist

### 4.1 Authentication & Authorisation
- [ ] JWT tokens expire at 15 minutes
- [ ] Refresh tokens expire at 7 days
- [ ] Logout invalidates refresh token in DB
- [ ] `authorize('STUDENT')` blocks non-student roles
- [ ] Password hash uses bcrypt with salt rounds ≥ 12
- [ ] Password reset tokens are single-use and expire in 1 hour
- [ ] Email verification tokens expire in 24 hours

### 4.2 API Security
- [ ] All endpoints validate input with express-validator
- [ ] No raw SQL queries (Prisma ORM only)
- [ ] File uploads validate MIME type and size (max 10MB)
- [ ] Rate limiting applied: 100 req/15min per IP
- [ ] CORS configured to allowed origins only
- [ ] Helmet.js security headers in place
- [ ] Sensitive routes require authentication

### 4.3 Data Privacy
- [ ] Student grades not exposed in public profile endpoint
- [ ] Parent contact details not exposed to scouts
- [ ] Documents served via authenticated Cloudinary URLs
- [ ] Passwords never returned in API responses
- [ ] Email not logged in production

### 4.4 OWASP Top 10 Compliance

| Vulnerability | Mitigation |
|---------------|------------|
| A01 Broken Access Control | Role-based middleware on all protected routes |
| A02 Cryptographic Failures | bcrypt for passwords, HTTPS only in production |
| A03 Injection | Prisma ORM prevents SQL injection; express-validator for inputs |
| A04 Insecure Design | Privacy model: scouts contact parents, not students |
| A05 Security Misconfiguration | Helmet.js, CORS whitelist, env vars not committed |
| A06 Vulnerable Components | Weekly dependency audit with `npm audit` |
| A07 Auth Failures | JWT expiry, refresh rotation, lockout after 5 failed logins |
| A08 Software & Data Integrity | All uploads scanned; Cloudinary transformations |
| A09 Security Logging | Morgan logging in development; error monitoring in production |
| A10 Server-Side Request Forgery | No user-controlled URLs in server HTTP calls |

---

## 5. Performance Testing

### 5.1 API Performance Targets

| Endpoint | Target P50 | Target P95 |
|----------|:----------:|:----------:|
| `GET /opportunities` (paginated) | < 100ms | < 300ms |
| `GET /opportunities/my/matches` | < 200ms | < 500ms |
| `GET /profile` | < 80ms | < 200ms |
| `POST /auth/login` | < 150ms | < 400ms |

### 5.2 Frontend Performance Targets (Lighthouse)

| Metric | Target |
|--------|--------|
| Performance Score | ≥ 90 |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3.0s |
| Cumulative Layout Shift | < 0.1 |
| Largest Contentful Paint | < 2.5s |

### 5.3 Load Testing Scenarios

```bash
# Simulate 50 concurrent users browsing opportunities
k6 run --vus 50 --duration 60s scripts/load-test-opportunities.js

# Simulate 20 students running match algorithm simultaneously
k6 run --vus 20 --duration 30s scripts/load-test-matches.js
```

**Acceptance criteria:** P95 response time < 500ms at 50 concurrent users with no errors.

---

## 6. Release Criteria

A release is approved only when ALL of the following pass:

### 6.1 Pre-release Checklist

- [ ] All unit tests pass (`npm test` — 0 failures)
- [ ] TypeScript compiles without errors (`tsc --noEmit`)
- [ ] ESLint passes with no errors (`eslint .`)
- [ ] Security checklist completed (Section 4)
- [ ] Database migrations run cleanly on fresh DB
- [ ] Seed script runs without errors
- [ ] `.env.example` updated if new env vars added
- [ ] No `console.log` in production code
- [ ] No hardcoded credentials or API keys
- [ ] All new API endpoints have validation middleware

### 6.2 Critical Smoke Tests (post-deploy)

1. Load landing page — 200 OK, < 3s
2. Register a new student account — success
3. Verify email via link — success
4. Login — returns JWT
5. Create profile with O Level results — scores calculated
6. View opportunities — at least 1 result
7. Run matches — at least 1 match returned

---

## 7. Bug Severity Classification

| Severity | Definition | SLA |
|----------|------------|-----|
| **P0 Critical** | Platform down, data loss, auth bypass | Fix within 4 hours |
| **P1 High** | Core feature broken, data corruption | Fix within 24 hours |
| **P2 Medium** | Feature degraded, workaround available | Fix within 3 days |
| **P3 Low** | UI issue, minor UX problem | Fix in next sprint |

---

## 8. Known Limitations (v1.0)

| Issue | Impact | Planned Fix |
|-------|--------|-------------|
| Scoring only uses O Level (not A Level) | Underestimates advanced students | v1.1 |
| Cultural activities not factored into OFS | Missing qualitative dimension | v1.2 |
| No duplicate match detection | Re-running matches creates duplicates | v1.1 |
| File upload requires Cloudinary credentials | Local dev requires real credentials | v1.1 — mock in dev |
| No email rate limiting | Potential spam abuse via forgot-password | v1.1 |

---

## 9. Accessibility Standards

All pages must meet **WCAG 2.1 Level AA**:

- [ ] All images have meaningful `alt` text
- [ ] Form inputs have associated `<label>` elements
- [ ] Colour contrast ratio ≥ 4.5:1 for text
- [ ] Keyboard navigation works for all interactive elements
- [ ] Error messages are descriptive and associated with inputs
- [ ] Focus states are visible
- [ ] Screen reader tested with NVDA and VoiceOver

---

## 10. Review and Approval

| Reviewer | Role | Date | Approved |
|----------|------|------|:--------:|
| Engineering Lead | Code quality, architecture | Oct 2024 | ✅ |
| Security Reviewer | OWASP compliance | Oct 2024 | ✅ |
| Product Manager | Feature completeness | Oct 2024 | ✅ |
| Student Tester | UX validation | Oct 2024 | ✅ |

---

*This QA document is updated at the start of each sprint and before every major release.*
