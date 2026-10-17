'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

const TIERS = [
  {
    key: null,
    name: 'Bronze',
    price: 'Free',
    color: 'border-orange-200 bg-orange-50/50',
    badge: 'bg-orange-100 text-orange-700',
    features: [
      'Create your student profile',
      'Browse all opportunity categories',
      'Save opportunities',
      'Basic profile dashboard',
    ],
    locked: ['Personalised matches', 'University recommendations', 'PDF reports', 'Agent contacts'],
    cta: 'Current Plan',
    ctaClass: 'bg-gray-100 text-gray-500 cursor-default',
    recommended: false,
  },
  {
    key: 'SILVER' as const,
    name: 'Silver',
    price: 'USD 5/mo',
    color: 'border-gray-300 bg-gray-50/50',
    badge: 'bg-gray-200 text-gray-700',
    features: [
      'Everything in Bronze',
      '2 personalised opportunity matches',
      'Opportunity Fit Score breakdown',
      'Apply directly or via agent',
    ],
    locked: ['All matches (unlimited)', 'AI-generated PDF report', 'Full institution details'],
    cta: 'Upgrade to Silver',
    ctaClass: 'bg-gray-800 hover:bg-gray-900 text-white',
    recommended: false,
  },
  {
    key: 'GOLD' as const,
    name: 'Gold',
    price: 'USD 12/mo',
    color: 'border-brand-gold bg-brand-gold/5 ring-2 ring-brand-gold/30',
    badge: 'bg-brand-gold/20 text-yellow-700',
    features: [
      'Everything in Silver',
      'Unlimited personalised matches',
      'Full institution names & details',
      'AI-generated opportunity report (PDF)',
      'Agent website & contact details',
      'Priority support',
    ],
    locked: [],
    cta: 'Upgrade to Gold',
    ctaClass: 'bg-brand-blue hover:bg-brand-blue/90 text-white',
    recommended: true,
  },
];

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);

  const success = searchParams.get('success');
  const cancelled = searchParams.get('cancelled');

  const handleUpgrade = async (tier: 'SILVER' | 'GOLD') => {
    try {
      setLoading(tier);
      const res = await api.post('/subscriptions/create-checkout', { tier });
      if (res.data?.data?.url) {
        window.location.href = res.data.data.url;
      }
    } catch (err) {
      console.error('Checkout error', err);
    } finally {
      setLoading(null);
    }
  };

  const currentTier = user?.subscriptionTier ?? 'BRONZE';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm font-medium text-center">
          Payment successful! Your plan has been upgraded.
        </div>
      )}
      {cancelled && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-700 text-sm font-medium text-center">
          Upgrade cancelled. Your plan was not changed.
        </div>
      )}

      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 bg-brand-gold/20 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Upgrade Your Plan
        </div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-3">Unlock Your Full Potential</h1>
        <p className="text-gray-500">Choose the plan that matches your ambitions</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {TIERS.map(tier => {
          const isCurrent = tier.key === null
            ? currentTier === 'BRONZE'
            : currentTier === tier.key;
          const isLoading = loading === tier.key;

          return (
            <div key={tier.name} className={`relative rounded-2xl border p-6 ${tier.color}`}>
              {tier.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-blue text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Recommended
                </div>
              )}
              <div className="mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tier.badge}`}>{tier.name}</span>
                <div className="text-2xl font-display font-bold text-gray-900 mt-3">{tier.price}</div>
              </div>
              <ul className="space-y-2 mb-6">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                {tier.locked.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-400 line-through">
                    <CheckCircle2 className="w-4 h-4 text-gray-200 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {tier.key === null || isCurrent ? (
                <button disabled className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-500 cursor-default">
                  {isCurrent ? 'Current Plan' : tier.cta}
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(tier.key!)}
                  disabled={isLoading}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${tier.ctaClass}`}
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {tier.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-gray-400">
        Payments processed securely via Stripe. Cancel anytime. Prices in USD.
      </p>
    </div>
  );
}
