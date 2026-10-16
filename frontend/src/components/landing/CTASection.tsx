'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-br from-brand-blue via-brand-blue-dark to-[#0d1f4a] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-gold/20 rounded-2xl mb-8 mx-auto">
            <Globe2 className="w-10 h-10 text-brand-gold" />
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
            Your Global Journey Starts Today
          </h2>
          <p className="text-xl text-white/75 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join 10,000+ African students who have already discovered their path to global excellence.
            Create your free profile in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto bg-brand-gold hover:bg-brand-gold-dark text-brand-blue font-bold text-base px-10 py-6 rounded-xl shadow-lg">
                Create Free Profile
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 text-base px-10 py-6 rounded-xl">
                Learn More
              </Button>
            </Link>
          </div>

          <p className="text-white/40 text-sm mt-6">
            Free forever for students. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
