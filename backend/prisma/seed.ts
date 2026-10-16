import { PrismaClient, OpportunityType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@Mwana2024', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mwanaglobal.com' },
    update: {},
    create: {
      email: 'admin@mwanaglobal.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: 'ADMIN',
      isEmailVerified: true,
      adminProfile: { create: { permissions: ['ALL'] } },
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Demo student
  const studentPassword = await bcrypt.hash('Student@123', 12);
  const student = await prisma.user.upsert({
    where: { email: 'demo.student@mwanaglobal.com' },
    update: {},
    create: {
      email: 'demo.student@mwanaglobal.com',
      password: studentPassword,
      firstName: 'Tendai',
      lastName: 'Moyo',
      role: 'STUDENT',
      isEmailVerified: true,
      studentProfile: {
        create: {
          country: 'Zimbabwe',
          city: 'Harare',
          school: 'St. George\'s College',
          graduationYear: 2025,
          biography: 'Passionate about technology and innovation. Aspiring software engineer with strong mathematics and science background.',
          gender: 'MALE',
          academicScore: 85,
          overallScore: 78,
          distinctions: 7,
          stemStrength: 90,
          oLevelResults: {
            createMany: {
              data: [
                { subject: 'Mathematics', grade: 'A', year: 2023, examBoard: 'ZIMSEC' },
                { subject: 'Physics', grade: 'A', year: 2023, examBoard: 'ZIMSEC' },
                { subject: 'Chemistry', grade: 'B', year: 2023, examBoard: 'ZIMSEC' },
                { subject: 'English Language', grade: 'A', year: 2023, examBoard: 'ZIMSEC' },
                { subject: 'Computer Science', grade: 'A', year: 2023, examBoard: 'ZIMSEC' },
                { subject: 'Biology', grade: 'B', year: 2023, examBoard: 'ZIMSEC' },
                { subject: 'Geography', grade: 'C', year: 2023, examBoard: 'ZIMSEC' },
              ],
            },
          },
          careerInterests: {
            createMany: {
              data: [{ interest: 'Computer Science' }, { interest: 'Engineering' }, { interest: 'Data Science' }],
            },
          },
          leadershipActivities: {
            createMany: {
              data: [
                { title: 'Prefect', description: 'School Prefect responsible for junior students', startYear: 2022, endYear: 2023 },
                { title: 'Club Leader', description: 'Chess Club Captain', startYear: 2021, isCurrentRole: true },
              ],
            },
          },
        },
      },
    },
  });
  console.log('✅ Demo student created:', student.email);

  // Universities
  const universities = await Promise.all([
    prisma.university.upsert({
      where: { id: 'univ-oxford' },
      update: {},
      create: {
        id: 'univ-oxford',
        name: 'University of Oxford',
        country: 'United Kingdom',
        city: 'Oxford',
        website: 'https://ox.ac.uk',
        ranking: 1,
        isVerified: true,
        description: 'One of the world\'s leading universities, with a reputation for excellence in teaching and research.',
      },
    }),
    prisma.university.upsert({
      where: { id: 'univ-mit' },
      update: {},
      create: {
        id: 'univ-mit',
        name: 'Massachusetts Institute of Technology',
        country: 'United States',
        city: 'Cambridge',
        website: 'https://mit.edu',
        ranking: 2,
        isVerified: true,
        description: 'A world-class education in science, technology, engineering, arts, and mathematics.',
      },
    }),
    prisma.university.upsert({
      where: { id: 'univ-uct' },
      update: {},
      create: {
        id: 'univ-uct',
        name: 'University of Cape Town',
        country: 'South Africa',
        city: 'Cape Town',
        website: 'https://uct.ac.za',
        ranking: 226,
        isVerified: true,
        description: 'Africa\'s leading research university, consistently ranked the best on the continent.',
      },
    }),
  ]);
  console.log(`✅ ${universities.length} universities created`);

  // Opportunities
  const opportunities = [
    {
      type: OpportunityType.SCHOLARSHIP,
      title: 'Mastercard Foundation Scholars Program',
      description: 'The Mastercard Foundation Scholars Program provides academically talented yet economically disadvantaged young Africans with access to quality secondary and post-secondary education, as well as leadership development, mentoring, and career preparation.',
      institution: 'Mastercard Foundation',
      country: 'Multiple Countries',
      eligibleCountries: ['Zimbabwe', 'Kenya', 'Uganda', 'Tanzania', 'Ghana', 'Nigeria', 'Rwanda', 'Ethiopia'],
      isFunded: true,
      fundingAmount: 'Full tuition + accommodation + stipend',
      tuitionCovered: true,
      accommodationCovered: true,
      academicWeight: 0.5,
      leadershipWeight: 0.35,
      sportsWeight: 0.05,
      isFeatured: true,
      applicationDeadline: new Date('2025-03-31'),
    },
    {
      type: OpportunityType.SCHOLARSHIP,
      title: 'Rhodes Scholarship',
      description: 'The Rhodes Scholarship is the oldest and most celebrated international fellowship award in the world. Rhodes Scholars are chosen for their outstanding scholastic achievements, character, leadership, and commitment to service.',
      institution: 'Rhodes Trust',
      country: 'United Kingdom',
      eligibleCountries: ['Zimbabwe', 'Kenya', 'South Africa', 'Nigeria', 'Ghana'],
      isFunded: true,
      fundingAmount: 'Full university fees, living allowance',
      tuitionCovered: true,
      accommodationCovered: true,
      academicWeight: 0.45,
      leadershipWeight: 0.45,
      sportsWeight: 0.1,
      isFeatured: true,
      minGrade: 'B',
      applicationDeadline: new Date('2025-06-30'),
      universityId: 'univ-oxford',
    },
    {
      type: OpportunityType.UNIVERSITY,
      title: 'BSc Computer Science - Oxford',
      description: 'Study Computer Science at one of the world\'s top universities. Oxford offers a rigorous programme combining theory and practice.',
      institution: 'University of Oxford',
      country: 'United Kingdom',
      eligibleCountries: [],
      isFunded: false,
      academicWeight: 0.6,
      leadershipWeight: 0.25,
      sportsWeight: 0.05,
      stemRequired: true,
      requiredSubjects: ['Mathematics', 'Computer Science'],
      isFeatured: true,
      universityId: 'univ-oxford',
    },
    {
      type: OpportunityType.SPORTS_RECRUITMENT,
      title: 'NCAA Division I Football Scholarship',
      description: 'American universities offer athletic scholarships for talented African football players. Full academic and living support for qualifying student-athletes.',
      institution: 'NCAA Universities',
      country: 'United States',
      eligibleCountries: [],
      isFunded: true,
      fundingAmount: 'Full athletic scholarship',
      tuitionCovered: true,
      accommodationCovered: true,
      academicWeight: 0.3,
      leadershipWeight: 0.1,
      sportsWeight: 0.6,
      sportsRequired: true,
      isFeatured: true,
    },
    {
      type: OpportunityType.FELLOWSHIP,
      title: 'YALI Regional Leadership Center - East & Southern Africa',
      description: 'The Young African Leaders Initiative (YALI) empowers young Africans to spur growth and prosperity, strengthen democratic governance, and enhance peace and security.',
      institution: 'YALI / US Embassy',
      country: 'Multiple Countries',
      eligibleCountries: ['Zimbabwe', 'Zambia', 'Malawi', 'Mozambique', 'Tanzania', 'Kenya'],
      isFunded: true,
      fundingAmount: 'Travel, accommodation, and training fully covered',
      tuitionCovered: true,
      accommodationCovered: true,
      academicWeight: 0.3,
      leadershipWeight: 0.6,
      sportsWeight: 0.0,
      isFeatured: false,
      applicationDeadline: new Date('2025-02-28'),
    },
    {
      type: OpportunityType.EXCHANGE_PROGRAMME,
      title: 'AFS Intercultural Exchange Program',
      description: 'Study abroad for one academic year in a host family. Available to students aged 15-18 from African countries.',
      institution: 'AFS Intercultural Programs',
      country: 'Multiple Countries',
      eligibleCountries: ['Zimbabwe', 'Kenya', 'Ghana', 'Nigeria', 'South Africa'],
      isFunded: true,
      fundingAmount: 'Partial scholarships available',
      academicWeight: 0.4,
      leadershipWeight: 0.3,
      sportsWeight: 0.1,
      isFeatured: false,
    },
    {
      type: OpportunityType.LEADERSHIP_PROGRAMME,
      title: 'African Leadership Academy',
      description: 'A two-year pre-university program for Africa\'s most promising young leaders aged 15-19. Located in Johannesburg, South Africa.',
      institution: 'African Leadership Academy',
      country: 'South Africa',
      eligibleCountries: [],
      isFunded: true,
      fundingAmount: 'Need-based scholarships available (up to 100%)',
      academicWeight: 0.4,
      leadershipWeight: 0.5,
      sportsWeight: 0.05,
      isFeatured: true,
      applicationDeadline: new Date('2025-01-15'),
    },
    {
      type: OpportunityType.INTERNSHIP,
      title: 'Google STEP Internship (Africa)',
      description: 'Google\'s internship program for first and second-year undergraduate students from Africa who are passionate about software engineering.',
      institution: 'Google',
      country: 'Kenya',
      eligibleCountries: [],
      isFunded: true,
      fundingAmount: 'Competitive salary + housing',
      stemRequired: true,
      requiredSubjects: ['Computer Science', 'Mathematics'],
      academicWeight: 0.5,
      leadershipWeight: 0.2,
      sportsWeight: 0.0,
      isFeatured: false,
    },
  ];

  for (const opp of opportunities) {
    await prisma.opportunity.create({ data: opp });
  }
  console.log(`✅ ${opportunities.length} opportunities created`);

  console.log('\n✨ Seeding complete!\n');
  console.log('Admin credentials:');
  console.log('  Email: admin@mwanaglobal.com');
  console.log('  Password: Admin@Mwana2024\n');
  console.log('Demo student credentials:');
  console.log('  Email: demo.student@mwanaglobal.com');
  console.log('  Password: Student@123\n');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
