'use client';

import { Trophy, Star, Medal, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { profileApi } from '@/lib/api';

export default function AchievementsPage() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getMyProfile().then(r => r.data.data),
  });

  const badges = [
    {
      id: 'profile-complete',
      title: 'Profile Pioneer',
      description: 'Completed your first profile section',
      icon: Star,
      earned: !!(profile?.country || profile?.school),
      color: 'text-yellow-500 bg-yellow-50',
    },
    {
      id: 'academic-ace',
      title: 'Academic Ace',
      description: 'Added 5+ O Level results',
      icon: Medal,
      earned: (profile?.oLevelResults?.length ?? 0) >= 5,
      color: 'text-blue-500 bg-blue-50',
    },
    {
      id: 'leader',
      title: 'Leader',
      description: 'Added a leadership activity',
      icon: Award,
      earned: (profile?.leadershipActivities?.length ?? 0) > 0,
      color: 'text-purple-500 bg-purple-50',
    },
    {
      id: 'athlete',
      title: 'Athlete',
      description: 'Added a sport to your profile',
      icon: Trophy,
      earned: (profile?.sportProfiles?.length ?? 0) > 0,
      color: 'text-green-500 bg-green-50',
    },
  ];

  const earned = badges.filter(b => b.earned);
  const locked = badges.filter(b => !b.earned);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Achievements</h1>
        <p className="text-gray-500 text-sm mt-1">Track your badges and milestones</p>
      </div>

      {earned.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Earned ({earned.length})</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {earned.map(badge => (
              <div key={badge.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${badge.color}`}>
                  <badge.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{badge.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {locked.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Locked ({locked.length})</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locked.map(badge => (
              <div key={badge.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-start gap-4 opacity-60">
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-600 text-sm">{badge.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
