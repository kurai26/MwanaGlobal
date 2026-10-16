import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { OpportunitiesSection } from '@/components/landing/OpportunitiesSection';
import { WhyMwana } from '@/components/landing/WhyMwana';
import { SuccessStories } from '@/components/landing/SuccessStories';
import { FAQ } from '@/components/landing/FAQ';
import { CTASection } from '@/components/landing/CTASection';
import { StatsSection } from '@/components/landing/StatsSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsSection />
        <HowItWorks />
        <OpportunitiesSection />
        <WhyMwana />
        <SuccessStories />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
