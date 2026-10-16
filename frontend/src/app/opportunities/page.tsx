import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Search, GraduationCap, Trophy, Globe, BookOpen, Users, Briefcase, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Opportunities | Mwana Global',
  description: 'Explore universities, scholarships, sports recruitment, fellowships, and more for African students.',
};

const CATEGORIES = [
  {
    icon: GraduationCap,
    title: 'Universities',
    count: '200+',
    description: 'Top institutions across Africa, UK, US, and beyond looking for African talent.',
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50 text-blue-700',
    href: '/auth/register',
  },
  {
    icon: Award,
    title: 'Scholarships',
    count: '150+',
    description: 'Fully funded and partial scholarships from governments, institutions, and foundations.',
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-50 text-yellow-700',
    href: '/auth/register',
  },
  {
    icon: Trophy,
    title: 'Sports Recruitment',
    count: '80+',
    description: 'Scouts and academies seeking African athletes for trials and recruitment.',
    color: 'bg-green-600',
    lightColor: 'bg-green-50 text-green-700',
    href: '/auth/register',
  },
  {
    icon: Globe,
    title: 'Exchange Programmes',
    count: '60+',
    description: 'Study abroad and cultural exchange opportunities worldwide.',
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50 text-purple-700',
    href: '/auth/register',
  },
  {
    icon: BookOpen,
    title: 'Fellowships',
    count: '40+',
    description: 'Prestigious leadership and research fellowships for exceptional students.',
    color: 'bg-pink-600',
    lightColor: 'bg-pink-50 text-pink-700',
    href: '/auth/register',
  },
  {
    icon: Users,
    title: 'Leadership Programmes',
    count: '50+',
    description: 'Camps, academies, and programmes building Africa\'s next generation of leaders.',
    color: 'bg-indigo-600',
    lightColor: 'bg-indigo-50 text-indigo-700',
    href: '/auth/register',
  },
  {
    icon: Briefcase,
    title: 'Internships',
    count: '70+',
    description: 'Paid and unpaid internships with top companies and organisations.',
    color: 'bg-orange-600',
    lightColor: 'bg-orange-50 text-orange-700',
    href: '/auth/register',
  },
  {
    icon: GraduationCap,
    title: 'In-Country Transfers',
    count: '30+',
    description: 'Transfer opportunities between universities within your country.',
    color: 'bg-teal-600',
    lightColor: 'bg-teal-50 text-teal-700',
    href: '/auth/register',
  },
];

export default function OpportunitiesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-blue to-brand-blue-light py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              500+ Opportunities<br />Waiting for <span className="text-brand-gold">Your Talent</span>
            </h1>
            <p className="text-white/80 text-lg mb-8">
              From world-class universities to elite sports academies, find every opportunity in one place.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-brand-gold text-brand-blue font-semibold px-8 py-3 rounded-xl hover:bg-brand-gold/90 transition-colors"
            >
              Create Free Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">Explore by Category</h2>
            <p className="text-gray-500">Create a free profile to unlock personalised matches and apply</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map(cat => (
              <Link key={cat.title} href={cat.href} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-brand-blue/20 transition-all">
                <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <cat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mb-3 ${cat.lightColor}`}>
                  {cat.count}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{cat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{cat.description}</p>
                <div className="flex items-center gap-1 mt-4 text-brand-blue text-sm font-medium group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50 py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Get Matched to the Right Opportunity
            </h2>
            <p className="text-gray-500 mb-8">
              Our Opportunity Fit Score algorithm analyses your full profile and finds your best matches — in seconds.
            </p>
            <Link href="/auth/register" className="inline-block bg-brand-blue text-white font-semibold px-8 py-3 rounded-xl hover:bg-brand-blue/90 transition-colors">
              Start for Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
