import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Users, Globe, Award, Heart, Lightbulb, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Mwana Global',
  description: 'Learn about our mission to connect Zimbabwean students with life-changing opportunities.',
};

const values = [
  {
    icon: Globe,
    title: 'Zimbabwean Excellence',
    description: 'We celebrate and elevate Zimbabwean talent, building pathways that honour the richness of Zimbabwe\'s students.',
  },
  {
    icon: Heart,
    title: 'Student-First',
    description: 'Every feature, every algorithm, every decision is made with the student at the centre — not institutions.',
  },
  {
    icon: Lightbulb,
    title: 'Data-Driven Fairness',
    description: 'Our matching algorithm uses transparent, weighted criteria so every student gets an equal, merit-based opportunity.',
  },
  {
    icon: Target,
    title: 'Impact at Scale',
    description: 'We measure success by students who access opportunities they would never have found without us.',
  },
];

const team = [
  {
    name: 'Tendai Mwangi',
    role: 'Co-Founder & CEO',
    bio: 'Former scholarship student at Oxford. Passionate about democratising access to global education.',
    country: 'Zimbabwe',
  },
  {
    name: 'Amara Osei',
    role: 'Co-Founder & CTO',
    bio: 'Full-stack engineer with 10+ years building education technology platforms across Sub-Saharan Africa.',
    country: 'Ghana',
  },
  {
    name: 'Fatima Hassan',
    role: 'Head of Partnerships',
    bio: 'Former admissions officer at three top universities. Bridges the gap between students and institutions.',
    country: 'Kenya',
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-blue to-brand-blue-light py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Discover Where Your <span className="text-brand-gold">Talent</span> Can Take You
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Mwana Global is building the platform that Zimbabwean students deserved all along — a single place where talent meets opportunity, regardless of background or geography.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Every year, thousands of talented Zimbabwean students miss out on life-changing scholarships, university places, and opportunities — not because they lack the ability, but because they lack access to information, guidance, and visibility.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Mwana Global changes that. We are building the LinkedIn, Common App, and scholarship match engine for Zimbabwean students — a comprehensive platform that builds their complete profile across academics, leadership, sports, and culture, then intelligently matches them to the right opportunities.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe that where you were born should not determine where you can go.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-blue rounded-2xl p-6 text-white">
                <p className="text-4xl font-display font-bold mb-1">10K+</p>
                <p className="text-white/80 text-sm">Student Profiles</p>
              </div>
              <div className="bg-brand-gold rounded-2xl p-6 text-brand-blue">
                <p className="text-4xl font-display font-bold mb-1">500+</p>
                <p className="text-brand-blue/80 text-sm">Opportunities</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <p className="text-4xl font-display font-bold text-brand-blue mb-1">$2M+</p>
                <p className="text-gray-500 text-sm">In Scholarships</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <p className="text-4xl font-display font-bold text-brand-blue mb-1">15+</p>
                <p className="text-gray-500 text-sm">Countries</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-gray-50 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">Our Values</h2>
              <p className="text-gray-500">The principles that guide everything we build</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(v => (
                <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="w-10 h-10 bg-brand-blue/10 rounded-xl flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-brand-blue" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-3">Meet the Team</h2>
            <p className="text-gray-500">Built for Zimbabwean Excellence</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {team.map(member => (
              <div key={member.name} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-brand-blue-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-display font-bold text-2xl">{member.name[0]}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-brand-blue text-sm font-medium">{member.role}</p>
                <p className="text-gray-400 text-xs mt-0.5">{member.country}</p>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-blue py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Join the Movement</h2>
            <p className="text-white/80 mb-8">Be part of the generation that changes the story of African education.</p>
            <a href="/auth/register" className="inline-block bg-brand-gold text-brand-blue font-semibold px-8 py-3 rounded-xl hover:bg-brand-gold/90 transition-colors">
              Create Your Profile Free
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
