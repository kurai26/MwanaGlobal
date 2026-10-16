'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowRight, Star, Globe, BookOpen, Trophy, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { profileApi, opportunityApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

function ScoreRing({ score, label }: { score: number; label: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} strokeWidth="8" className="stroke-gray-100 fill-none" />
          <circle
            cx="44" cy="44" r={r}
            strokeWidth="8"
            className="stroke-brand-blue fill-none transition-all duration-1000"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-xl text-brand-blue">
          {score}
        </span>
      </div>
      <span className="text-sm text-gray-600 font-medium">{label}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getMyProfile().then(r => r.data.data),
    enabled: user?.role === 'STUDENT',
  });

  const { data: matchData } = useQuery({
    queryKey: ['matches'],
    queryFn: () => opportunityApi.getMyMatches().then(r => r.data.data),
    enabled: user?.role === 'STUDENT',
  });

  const profile = profileData;
  const matches = matchData?.slice(0, 3) ?? [];

  const profileCompleteness = profile ? Math.min(100, [
    profile.user?.firstName, profile.country, profile.school, profile.biography, profile.profilePhotoUrl,
    profile.oLevelResults?.length > 0, profile.careerInterests?.length > 0,
    profile.leadershipActivities?.length > 0,
  ].filter(Boolean).length * 12.5) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-blue-light rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold mb-1">
              Welcome back, {user?.firstName}! 👋
            </h2>
            <p className="text-white/75">
              {matches.length > 0
                ? `You have ${matches.length} new opportunity matches. Your journey continues.`
                : 'Complete your profile to unlock personalised opportunity matches.'}
            </p>
          </div>
          <Link href="/dashboard/profile">
            <Button className="bg-brand-gold text-brand-blue hover:bg-brand-gold-dark font-semibold">
              Complete Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: 'Overall Score', value: profile?.overallScore ?? '—', suffix: profile?.overallScore ? '/100' : '' },
          { icon: Star, label: 'Opportunity Matches', value: matches.length, suffix: '' },
          { icon: BookOpen, label: 'Applications', value: 0, suffix: '' },
          { icon: Trophy, label: 'Distinctions', value: profile?.distinctions ?? 0, suffix: '' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                <stat.icon className="w-4.5 h-4.5 text-brand-blue" />
              </div>
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
            <div className="text-2xl font-display font-bold text-gray-900">
              {stat.value}<span className="text-sm text-gray-400 font-normal">{stat.suffix}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile completeness */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-gray-900">Profile Completeness</h3>
            <span className="text-brand-blue font-bold">{Math.round(profileCompleteness)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
            <div
              className="bg-gradient-to-r from-brand-blue to-brand-blue-light h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
          {profileCompleteness < 100 && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">
                Complete your profile to improve your opportunity matches.
              </p>
            </div>
          )}
          <Link href="/dashboard/profile">
            <Button variant="outline" className="w-full mt-4 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
              Update Profile
            </Button>
          </Link>
        </div>

        {/* Score breakdown */}
        {profile && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-display font-bold text-gray-900 mb-6">Score Breakdown</h3>
            <div className="flex justify-around">
              <ScoreRing score={profile.academicScore ?? 0} label="Academic" />
              <ScoreRing score={profile.overallScore ?? 0} label="Overall" />
            </div>
          </div>
        )}

        {/* Top matches */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-gray-900">Top Matches</h3>
            <Link href="/dashboard/matches" className="text-brand-blue text-sm font-medium hover:underline">View all</Link>
          </div>
          {matches.length === 0 ? (
            <div className="text-center py-6">
              <Globe className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Complete your profile to see matches</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match: Record<string, unknown>) => {
                const opp = match.opportunity as Record<string, unknown>;
                return (
                  <Link key={String(opp.id)} href={`/opportunities/${opp.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{String(opp.title)}</p>
                      <p className="text-xs text-gray-500">{String(opp.institution)}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-brand-blue font-bold text-sm">{String(match.fitScore)}%</span>
                      <span className="text-gray-400 text-[10px]">fit</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
