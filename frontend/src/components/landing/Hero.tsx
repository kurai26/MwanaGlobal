'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star, Users, Globe2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const socialProof = [
  { icon: Users, value: '10,000+', label: 'Student Profiles' },
  { icon: Globe2, value: '50+', label: 'Countries' },
  { icon: Trophy, value: '$2M+', label: 'In Scholarships' },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue-dark to-[#0d1f4a]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue-light/20 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating cards */}
      <motion.div
        className="absolute top-32 right-8 md:right-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hidden lg:flex items-center gap-3"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-10 h-10 bg-brand-gold/20 rounded-xl flex items-center justify-center">
          <Trophy className="w-5 h-5 text-brand-gold" />
        </div>
        <div>
          <p className="text-white text-sm font-semibold">New Match!</p>
          <p className="text-white/60 text-xs">Rhodes Scholarship — 94% fit</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-48 right-12 md:right-32 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hidden lg:flex items-center gap-3"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <div className="w-10 h-10 bg-green-400/20 rounded-xl flex items-center justify-center">
          <Star className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <p className="text-white text-sm font-semibold">Profile Complete</p>
          <p className="text-white/60 text-xs">85% match accuracy</p>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="inline-flex items-center gap-2 bg-brand-gold/15 border border-brand-gold/30 rounded-full px-4 py-2 mb-8">
            <Globe2 className="w-4 h-4 text-brand-gold" />
            <span className="text-brand-gold text-sm font-medium">Africa's #1 Student Opportunity Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-[1.1]"
          >
            Discover Where Your{' '}
            <span className="relative">
              <span className="text-brand-gold">Talent</span>
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <motion.path
                  d="M2 9 C75 2, 150 11, 298 4"
                  stroke="#D4AF37"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>{' '}
            Can Take You
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-xl md:text-2xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Mwana Global matches African students with scholarships, universities, sports
            recruitment opportunities and global education pathways.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/auth/register">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-brand-gold hover:bg-brand-gold-dark text-brand-blue font-bold text-base px-8 py-6 rounded-xl shadow-lg shadow-brand-gold/25 transition-all hover:scale-105"
              >
                Create Student Profile
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-base px-8 py-6 rounded-xl backdrop-blur-sm"
              >
                <Globe2 className="mr-2 w-5 h-5" />
                Explore Opportunities
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {socialProof.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-2 mx-auto">
                  <Icon className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="text-white font-bold text-xl font-display">{value}</div>
                <div className="text-white/60 text-sm">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 20C1200 55 960 0 720 15C480 30 240 55 0 20L0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
