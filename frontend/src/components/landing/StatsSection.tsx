'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const stats = [
  { value: 10000, suffix: '+', label: 'Student Profiles', description: 'Across Zimbabwe' },
  { value: 500, suffix: '+', label: 'Opportunities', description: 'Universities, scholarships & more' },
  { value: 2, prefix: '$', suffix: 'M+', label: 'In Scholarships', description: 'Facilitated for Zimbabwean students' },
  { value: 95, suffix: '%', label: 'Match Accuracy', description: 'AI-powered opportunity matching' },
];

function Counter({ end, prefix = '', suffix = '', duration = 2000 }: { end: number; prefix?: string; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(Math.floor(start));
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-display font-bold text-brand-blue mb-1">
                <Counter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="font-semibold text-gray-800 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
