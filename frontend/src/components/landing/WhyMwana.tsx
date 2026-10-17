'use client';

import { motion } from 'framer-motion';
import { Sparkles, Search, Trophy, Map, Shield, Users, Globe2, Zap } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Matching',
    description: 'Our Weighted Opportunity Fit Score algorithm analyses your academic profile, leadership, and sports achievements to surface the most relevant opportunities — sorted by fit score.',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: Search,
    title: 'Scholarship Discovery',
    description: 'Access thousands of scholarships specifically available to Zimbabwean students — from STEM to arts, sports to humanities. Filter by funding level and deadline.',
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    icon: Trophy,
    title: 'Sports Recruitment',
    description: 'NCAA coaches, professional academies, and scouts actively search Mwana Global for talented Zimbabwean athletes. Showcase your highlights and statistics.',
    color: 'bg-green-100 text-green-700',
  },
  {
    icon: Map,
    title: 'Personalised Roadmaps',
    description: 'Get a step-by-step action plan for your dream opportunity. From application requirements to deadline reminders and preparation resources.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Shield,
    title: 'Verified Profiles',
    description: 'Teacher, headmaster, and coach recommendations are verified. Universities and scouts trust Mwana Global profiles for accuracy and authenticity.',
    color: 'bg-red-100 text-red-700',
  },
  {
    icon: Users,
    title: 'Protected Students',
    description: 'Universities and scouts contact parents, not students directly. Your child\'s privacy and safety is our top priority at every step.',
    color: 'bg-indigo-100 text-indigo-700',
  },
  {
    icon: Globe2,
    title: 'Zimbabwean Network',
    description: 'Connect with students across Zimbabwe and beyond. Learn from peers who have successfully navigated the application process.',
    color: 'bg-teal-100 text-teal-700',
  },
  {
    icon: Zap,
    title: 'Instant Notifications',
    description: 'Get alerted the moment a new opportunity matching your profile is added. Never miss a deadline with our smart notification system.',
    color: 'bg-orange-100 text-orange-700',
  },
];

export function WhyMwana() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-brand-blue/10 text-brand-blue text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Why Mwana Global
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Why Students Love Mwana Global
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're not just a directory. We're your partner in accessing global opportunities.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
