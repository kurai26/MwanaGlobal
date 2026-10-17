'use client';

import { motion } from 'framer-motion';
import { UserPlus, Upload, Sparkles, Send } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Build your comprehensive student profile showcasing your academic results, leadership roles, sports achievements, and cultural activities.',
    color: 'bg-blue-50 text-brand-blue',
    iconBg: 'bg-brand-blue',
  },
  {
    step: '02',
    icon: Upload,
    title: 'Upload Results & Achievements',
    description: 'Upload your O Level and A Level results, recommendation letters from teachers, headmaster, and coaches.',
    color: 'bg-gold-50 text-brand-gold-dark',
    iconBg: 'bg-brand-gold',
  },
  {
    step: '03',
    icon: Sparkles,
    title: 'Get Matched',
    description: 'Our AI-powered Weighted Opportunity Fit Score algorithm matches you with the most relevant scholarships, universities, and programmes.',
    color: 'bg-purple-50 text-purple-600',
    iconBg: 'bg-purple-600',
  },
  {
    step: '04',
    icon: Send,
    title: 'Apply With Confidence',
    description: 'Submit applications with a complete, verified profile. Universities and scouts can discover your talent directly.',
    color: 'bg-green-50 text-green-600',
    iconBg: 'bg-green-600',
  },
];

export function HowItWorks() {
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
            Simple Process
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Four simple steps to unlock global opportunities for Zimbabwean students.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line on desktop */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-brand-blue via-brand-gold to-green-500 opacity-30" />

          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative group"
            >
              {/* Step number */}
              <div className="flex flex-col items-center text-center">
                <div className={`relative w-16 h-16 rounded-2xl ${step.iconBg} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8 text-white" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-gray-700 shadow-sm border border-gray-100">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
