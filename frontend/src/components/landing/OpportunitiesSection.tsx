'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, DollarSign, Trophy, Plane, Users, Briefcase, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  {
    icon: GraduationCap,
    title: 'Universities',
    description: 'Access top universities across the globe. Oxford, MIT, UCT, and hundreds more.',
    count: '200+',
    color: 'from-blue-500 to-brand-blue',
    bg: 'bg-blue-50',
    href: '/opportunities?type=UNIVERSITY',
  },
  {
    icon: DollarSign,
    title: 'Scholarships',
    description: 'Full and partial scholarships for African students. No financial barrier is too great.',
    count: '150+',
    color: 'from-brand-gold to-yellow-400',
    bg: 'bg-yellow-50',
    href: '/opportunities?type=SCHOLARSHIP',
    featured: true,
  },
  {
    icon: Trophy,
    title: 'Sports Recruitment',
    description: 'NCAA, professional academies, and sports scholarships for talented athletes.',
    count: '80+',
    color: 'from-green-500 to-emerald-400',
    bg: 'bg-green-50',
    href: '/opportunities?type=SPORTS_RECRUITMENT',
  },
  {
    icon: Plane,
    title: 'Exchange Programmes',
    description: 'Study abroad for a year. Experience different cultures and academic systems.',
    count: '40+',
    color: 'from-purple-500 to-violet-400',
    bg: 'bg-purple-50',
    href: '/opportunities?type=EXCHANGE_PROGRAMME',
  },
  {
    icon: Star,
    title: 'Fellowships',
    description: 'Prestigious fellowships for future African leaders. YALI, Rhodes, and more.',
    count: '30+',
    color: 'from-orange-500 to-red-400',
    bg: 'bg-orange-50',
    href: '/opportunities?type=FELLOWSHIP',
  },
  {
    icon: Users,
    title: 'Leadership Programmes',
    description: 'African Leadership Academy, Mandela Rhodes, and world-class leadership tracks.',
    count: '25+',
    color: 'from-teal-500 to-cyan-400',
    bg: 'bg-teal-50',
    href: '/opportunities?type=LEADERSHIP_PROGRAMME',
  },
  {
    icon: Briefcase,
    title: 'Internships',
    description: 'Early career opportunities at global companies. Build experience while studying.',
    count: '60+',
    color: 'from-pink-500 to-rose-400',
    bg: 'bg-pink-50',
    href: '/opportunities?type=INTERNSHIP',
  },
  {
    icon: MapPin,
    title: 'Local Transfers',
    description: 'In-country university transfers and articulation opportunities.',
    count: '35+',
    color: 'from-slate-500 to-gray-400',
    bg: 'bg-slate-50',
    href: '/opportunities?type=IN_COUNTRY_TRANSFER',
  },
];

export function OpportunitiesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-brand-gold/15 text-brand-gold-dark text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            All Opportunities
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Every Path to Success, In One Place
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From full scholarships to sports recruitment — discover every opportunity available to African students.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={cat.href}>
                <div className={`group relative p-6 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer card-hover ${cat.bg} ${cat.featured ? 'ring-2 ring-brand-gold ring-offset-2' : ''}`}>
                  {cat.featured && (
                    <span className="absolute -top-2.5 left-4 bg-brand-gold text-brand-blue text-xs font-bold px-3 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold text-gray-900 text-lg">{cat.title}</h3>
                    <span className="text-sm font-semibold text-brand-blue bg-brand-blue/10 px-2.5 py-0.5 rounded-full">{cat.count}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{cat.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/opportunities">
            <Button size="lg" className="bg-brand-blue hover:bg-brand-blue-light text-white px-8 font-semibold rounded-xl">
              View All Opportunities
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
