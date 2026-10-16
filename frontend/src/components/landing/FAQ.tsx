'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: 'Is Mwana Global free for students?',
    a: 'Yes! Creating a student profile and accessing opportunity matches is completely free. We believe every African student deserves access to global opportunities regardless of financial status.',
  },
  {
    q: 'Which African countries are supported?',
    a: 'Mwana Global supports students from all African countries. Our opportunity database includes scholarships and programmes specifically targeting students from Zimbabwe, Kenya, Ghana, Nigeria, South Africa, Uganda, Tanzania, Rwanda, and many more countries.',
  },
  {
    q: 'How does the matching algorithm work?',
    a: 'Our Weighted Opportunity Fit Score analyses your academic results, leadership experience, sports achievements, career interests, and country of origin to calculate a personalised fit percentage for each opportunity. Higher scores mean better alignment.',
  },
  {
    q: 'Can universities see my profile without my permission?',
    a: 'Universities and scouts can only see your profile if you set it to public. They can only contact your registered parent or guardian — never directly to students. Your safety is our priority.',
  },
  {
    q: 'What documents can I upload?',
    a: 'You can upload O Level and A Level results, headmaster recommendations, teacher recommendations, coach recommendations, certificates, awards, transcripts, and sports highlight videos. We support PDF, DOCX, images, and MP4/MOV videos.',
  },
  {
    q: 'How are recommendations verified?',
    a: 'Recommendations submitted through Mwana Global are verified by contacting the recommending institution. Verified recommendations carry a verification badge that increases your profile credibility with universities and scouts.',
  },
  {
    q: 'What is the difference between a scholarship and a fellowship?',
    a: 'Scholarships primarily cover educational costs (tuition, accommodation) and are typically for undergraduate or postgraduate studies. Fellowships are usually short-to-medium term leadership and professional development programmes.',
  },
  {
    q: 'Can parents create accounts?',
    a: 'Yes! Parents can create an account linked to their child\'s student profile. University representatives and scouts will contact parents (not students) when they express interest in a student profile.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-brand-blue/10 text-brand-blue text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            FAQs
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Mwana Global.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown className={cn('w-5 h-5 text-gray-400 flex-shrink-0 transition-transform', open === i && 'rotate-180')} />
              </button>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 text-gray-600 leading-relaxed"
                >
                  {faq.a}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
