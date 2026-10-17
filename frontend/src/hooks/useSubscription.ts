import { useAuthStore } from '@/store/authStore';

const tierRank = { BRONZE: 0, SILVER: 1, GOLD: 2 } as const;

export function useSubscription() {
  const user = useAuthStore(s => s.user);
  const tier = (user?.subscriptionTier ?? 'BRONZE') as 'BRONZE' | 'SILVER' | 'GOLD';

  return {
    tier,
    isBronze: tier === 'BRONZE',
    isSilver: tier === 'SILVER',
    isGold: tier === 'GOLD',
    canAccess: (minTier: 'BRONZE' | 'SILVER' | 'GOLD') => tierRank[tier] >= tierRank[minTier],
    matchLimit: tier === 'BRONZE' ? 0 : tier === 'SILVER' ? 2 : Infinity,
    showMasked: tier === 'SILVER',
  };
}
