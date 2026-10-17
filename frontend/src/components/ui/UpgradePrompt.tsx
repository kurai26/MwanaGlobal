import Link from 'next/link';
import { Lock, Sparkles } from 'lucide-react';

interface UpgradePromptProps {
  tier: 'SILVER' | 'GOLD';
  message: string;
}

export function UpgradePrompt({ tier, message }: UpgradePromptProps) {
  return (
    <div className="bg-gradient-to-br from-brand-blue/5 to-brand-gold/10 border border-brand-gold/30 rounded-2xl p-8 text-center">
      <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Lock className="w-5 h-5 text-brand-gold" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-500 text-sm mb-4">
        Upgrade to <span className="font-semibold text-brand-blue">{tier}</span> to unlock this feature.
      </p>
      <Link
        href="/dashboard/upgrade"
        className="inline-flex items-center gap-1.5 bg-brand-blue text-white font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-brand-blue/90 transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Upgrade Now
      </Link>
    </div>
  );
}
