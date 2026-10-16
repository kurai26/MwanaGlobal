'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Aisha Mensah',
    country: 'Ghana',
    achievement: 'Full Mastercard Foundation Scholarship',
    university: 'University of Cape Town',
    quote: 'Mwana Global matched me with the Mastercard Foundation Scholarship — something I would never have found on my own. My fit score was 91% and the application guidance was invaluable.',
    initials: 'AM',
    color: 'from-brand-blue to-brand-blue-light',
  },
  {
    name: 'Tariro Zvobgo',
    country: 'Zimbabwe',
    achievement: 'NCAA Division I Football Scholarship',
    university: 'University of South Carolina',
    quote: 'As a footballer, I dreamed of studying in America. Mwana Global\'s sports recruitment feature connected me directly with NCAA scouts. Within 3 months, I had a full athletic scholarship.',
    initials: 'TZ',
    color: 'from-green-500 to-emerald-400',
  },
  {
    name: 'Kemunto Achieng',
    country: 'Kenya',
    achievement: 'YALI Fellowship',
    university: 'Young African Leaders Initiative',
    quote: 'I never thought I qualified for fellowships until Mwana Global showed me I had a 78% match. The roadmap told me exactly what I needed. Today I\'m a YALI fellow.',
    initials: 'KA',
    color: 'from-purple-500 to-violet-400',
  },
];

export function SuccessStories() {
  return (
    <section className="section-padding bg-brand-blue relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue-light/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-brand-gold/20 text-brand-gold text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            Students Who Made It
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Real students. Real opportunities. Real transformations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-colors"
            >
              <Quote className="w-8 h-8 text-brand-gold mb-4 opacity-60" />
              <p className="text-white/85 leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-brand-gold text-sm font-medium">{t.achievement}</p>
                  <p className="text-white/50 text-xs">{t.university} · {t.country}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-white/60 text-lg">
            Your success story starts with a profile. Join <span className="text-brand-gold font-semibold">10,000+</span> African students already on the platform.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
