'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { opportunityApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, ExternalLink, MapPin, Calendar, Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeColors: Record<string, string> = {
  UNIVERSITY: 'bg-blue-100 text-blue-700',
  SCHOLARSHIP: 'bg-yellow-100 text-yellow-700',
  SPORTS_RECRUITMENT: 'bg-green-100 text-green-700',
  EXCHANGE_PROGRAMME: 'bg-purple-100 text-purple-700',
  FELLOWSHIP: 'bg-pink-100 text-pink-700',
  LEADERSHIP_PROGRAMME: 'bg-indigo-100 text-indigo-700',
  INTERNSHIP: 'bg-orange-100 text-orange-700',
  IN_COUNTRY_TRANSFER: 'bg-teal-100 text-teal-700',
};

const typeLabel: Record<string, string> = {
  UNIVERSITY: 'University', SCHOLARSHIP: 'Scholarship', SPORTS_RECRUITMENT: 'Sports',
  EXCHANGE_PROGRAMME: 'Exchange', FELLOWSHIP: 'Fellowship', LEADERSHIP_PROGRAMME: 'Leadership',
  INTERNSHIP: 'Internship', IN_COUNTRY_TRANSFER: 'Transfer',
};

export default function MatchesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-matches'],
    queryFn: () => opportunityApi.getMyMatches().then(r => r.data.data),
  });

  const { data: savedData } = useQuery({
    queryKey: ['saved-opportunities'],
    queryFn: () => opportunityApi.getSaved().then(r => r.data.data),
  });

  const savedIds = new Set((savedData?.savedOpportunities ?? []).map((s: any) => s.opportunityId ?? s.id));

  const saveMutation = useMutation({
    mutationFn: (id: string) => opportunityApi.save(id),
    onSuccess: () => {
      toast.success('Saved');
      queryClient.invalidateQueries({ queryKey: ['saved-opportunities'] });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: (id: string) => opportunityApi.unsave(id),
    onSuccess: () => {
      toast.success('Removed');
      queryClient.invalidateQueries({ queryKey: ['saved-opportunities'] });
    },
  });

  const matches = data?.matches ?? [];

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-500 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">My Matches</h1>
          <p className="text-gray-500 text-sm mt-1">Personalised opportunities ranked by your Fit Score</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { refetch(); toast.info('Refreshing matches...'); }}>
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      {matches.length > 0 && (
        <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-xl p-4 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-brand-blue flex-shrink-0" />
          <p className="text-sm text-brand-blue">
            <span className="font-semibold">{matches.length} personalised matches</span> — ranked by your Opportunity Fit Score based on your academic, leadership, and sports profile.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse flex gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && matches.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No matches yet</p>
          <p className="text-sm mt-1">Complete your profile to unlock personalised matches</p>
        </div>
      )}

      <div className="space-y-3">
        {matches.map((match: any, idx: number) => {
          const opp = match.opportunity ?? match;
          const score = match.fitScore ?? match.score ?? 0;
          const isSaved = savedIds.has(opp.id);

          return (
            <div key={match.id ?? opp.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-brand-blue/20 transition-all">
              <div className="flex items-start gap-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg flex-shrink-0', scoreColor(score))}>
                  {score}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', typeColors[opp.type] ?? 'bg-gray-100 text-gray-600')}>
                          {typeLabel[opp.type] ?? opp.type}
                        </span>
                        {idx < 3 && (
                          <span className="text-xs bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full font-medium">Top Match</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">{opp.title}</h3>
                      {opp.institution && <p className="text-gray-500 text-xs mt-0.5">{opp.institution}</p>}
                    </div>
                    <button
                      onClick={() => isSaved ? unsaveMutation.mutate(opp.id) : saveMutation.mutate(opp.id)}
                      className={cn('p-1.5 rounded-lg transition-colors flex-shrink-0', isSaved ? 'text-brand-blue' : 'text-gray-300 hover:text-brand-blue')}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-gray-600 text-xs mt-1.5 line-clamp-2">{opp.description}</p>

                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                    {opp.country && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{opp.country}</span>}
                    {opp.deadline && (
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                        {new Date(opp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>

                  {match.breakdown && (
                    <div className="flex gap-3 mt-3">
                      {match.breakdown.academic !== undefined && (
                        <div className="text-xs">
                          <span className="text-gray-400">Academic </span>
                          <span className="font-medium text-gray-700">{Math.round(match.breakdown.academic)}</span>
                        </div>
                      )}
                      {match.breakdown.leadership !== undefined && (
                        <div className="text-xs">
                          <span className="text-gray-400">Leadership </span>
                          <span className="font-medium text-gray-700">{Math.round(match.breakdown.leadership)}</span>
                        </div>
                      )}
                      {match.breakdown.sports !== undefined && (
                        <div className="text-xs">
                          <span className="text-gray-400">Sports </span>
                          <span className="font-medium text-gray-700">{Math.round(match.breakdown.sports)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {opp.applicationUrl && (
                <div className="mt-3 flex justify-end">
                  <a href={opp.applicationUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-brand-blue hover:bg-brand-blue/90 text-xs">
                      Apply <ExternalLink className="w-3 h-3 ml-1.5" />
                    </Button>
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
