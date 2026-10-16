'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { opportunityApi } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bookmark, BookmarkCheck, ExternalLink, Search, Filter, Calendar, MapPin, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const OPPORTUNITY_TYPES = [
  'ALL', 'UNIVERSITY', 'SCHOLARSHIP', 'SPORTS_RECRUITMENT', 'EXCHANGE_PROGRAMME',
  'FELLOWSHIP', 'LEADERSHIP_PROGRAMME', 'INTERNSHIP', 'IN_COUNTRY_TRANSFER',
];

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
  UNIVERSITY: 'University',
  SCHOLARSHIP: 'Scholarship',
  SPORTS_RECRUITMENT: 'Sports',
  EXCHANGE_PROGRAMME: 'Exchange',
  FELLOWSHIP: 'Fellowship',
  LEADERSHIP_PROGRAMME: 'Leadership',
  INTERNSHIP: 'Internship',
  IN_COUNTRY_TRANSFER: 'Transfer',
};

export default function OpportunitiesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('ALL');
  const [funded, setFunded] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['opportunities', { search, type, funded }],
    queryFn: () => opportunityApi.getAll({
      search: search || undefined,
      type: type !== 'ALL' ? type : undefined,
      funded: funded === 'funded' ? true : funded === 'self-funded' ? false : undefined,
    }).then(r => r.data.data),
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
      toast.success('Removed from saved');
      queryClient.invalidateQueries({ queryKey: ['saved-opportunities'] });
    },
  });

  const opportunities = data?.opportunities ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Opportunities</h1>
        <p className="text-gray-500 text-sm mt-1">Explore universities, scholarships, and programmes</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search opportunities..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {OPPORTUNITY_TYPES.map(t => (
              <SelectItem key={t} value={t}>{t === 'ALL' ? 'All Types' : typeLabel[t] ?? t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={funded} onValueChange={setFunded}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Funding" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="funded">Fully Funded</SelectItem>
            <SelectItem value="self-funded">Self-funded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && opportunities.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No opportunities found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {opportunities.map((opp: any) => {
          const isSaved = savedIds.has(opp.id);
          return (
            <div key={opp.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-brand-blue/20 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', typeColors[opp.type] ?? 'bg-gray-100 text-gray-600')}>
                  {typeLabel[opp.type] ?? opp.type}
                </span>
                <button
                  onClick={() => isSaved ? unsaveMutation.mutate(opp.id) : saveMutation.mutate(opp.id)}
                  className={cn('p-1.5 rounded-lg transition-colors', isSaved ? 'text-brand-blue' : 'text-gray-300 hover:text-brand-blue')}
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>

              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{opp.title}</h3>
              {opp.institution && <p className="text-gray-500 text-xs mb-3">{opp.institution}</p>}

              <p className="text-gray-600 text-xs line-clamp-2 mb-3">{opp.description}</p>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400 mb-4">
                {opp.country && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{opp.country}</span>
                )}
                {opp.deadline && (
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                    {new Date(opp.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
                {opp.funded && (
                  <span className="flex items-center gap-1 text-green-600"><DollarSign className="w-3 h-3" />Funded</span>
                )}
              </div>

              {opp.applicationUrl && (
                <a href={opp.applicationUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="w-full bg-brand-blue hover:bg-brand-blue/90 text-xs">
                    Apply Now <ExternalLink className="w-3 h-3 ml-1.5" />
                  </Button>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
