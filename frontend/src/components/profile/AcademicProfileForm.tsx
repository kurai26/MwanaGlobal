'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { profileApi } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Loader2, BookOpen } from 'lucide-react';

const GRADES = ['A*', 'A', 'B', 'C', 'D', 'E', 'U'];
const ZIMSEC_SUBJECTS = [
  'Mathematics', 'English Language', 'English Literature', 'Combined Science',
  'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'Shona', 'Ndebele',
  'Accounts', 'Business Studies', 'Economics', 'Computer Science', 'Agriculture',
  'Food and Nutrition', 'Fashion and Fabrics', 'Technical Graphics', 'Building Technology',
  'Art', 'Music', 'Physical Education', 'Religious Education',
];

interface SubjectRow { subject: string; grade: string; }

interface Props { profile: any; }

export function AcademicProfileForm({ profile }: Props) {
  const queryClient = useQueryClient();

  const [oLevel, setOLevel] = useState<SubjectRow[]>(
    profile?.oLevelResults?.map((r: any) => ({ subject: r.subject, grade: r.grade })) ?? [{ subject: '', grade: '' }]
  );
  const [aLevel, setALevel] = useState<SubjectRow[]>(
    profile?.aLevelResults?.map((r: any) => ({ subject: r.subject, grade: r.grade })) ?? []
  );

  const mutation = useMutation({
    mutationFn: () => profileApi.upsertOLevelResults({ results: oLevel.filter(r => r.subject && r.grade) }),
    onSuccess: () => {
      toast.success('Academic results saved');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => toast.error('Failed to save results'),
  });

  const aLevelMutation = useMutation({
    mutationFn: () => profileApi.upsertALevelResults({ results: aLevel.filter(r => r.subject && r.grade) }),
    onSuccess: () => {
      toast.success('A-Level results saved');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => toast.error('Failed to save results'),
  });

  const addRow = (level: 'o' | 'a') => {
    if (level === 'o') setOLevel(prev => [...prev, { subject: '', grade: '' }]);
    else setALevel(prev => [...prev, { subject: '', grade: '' }]);
  };

  const updateRow = (level: 'o' | 'a', idx: number, field: keyof SubjectRow, value: string) => {
    const setter = level === 'o' ? setOLevel : setALevel;
    setter(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const removeRow = (level: 'o' | 'a', idx: number) => {
    const setter = level === 'o' ? setOLevel : setALevel;
    setter(prev => prev.filter((_, i) => i !== idx));
  };

  const gradeColor = (grade: string) => {
    if (['A*', 'A'].includes(grade)) return 'success';
    if (grade === 'B') return 'blue';
    if (grade === 'C') return 'warning';
    return 'outline';
  };

  const distinctions = oLevel.filter(r => ['A*', 'A'].includes(r.grade)).length
    + aLevel.filter(r => ['A*', 'A'].includes(r.grade)).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-1">Academic Results</h3>
          <p className="text-sm text-gray-500">Enter your ZIMSEC or Cambridge results</p>
        </div>
        {distinctions > 0 && (
          <div className="flex items-center gap-2 bg-yellow-50 rounded-xl px-3 py-2">
            <BookOpen className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-700">{distinctions} Distinctions</span>
          </div>
        )}
      </div>

      {/* O Level */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">O Level Results</h4>
          <Button type="button" variant="outline" size="sm" onClick={() => addRow('o')}>
            <Plus className="w-3.5 h-3.5 mr-1" />Add Subject
          </Button>
        </div>
        <div className="space-y-2">
          {oLevel.map((row, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex-1">
                <Select value={row.subject} onValueChange={v => updateRow('o', idx, 'subject', v)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZIMSEC_SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Select value={row.grade} onValueChange={v => updateRow('o', idx, 'grade', v)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {row.grade && <Badge variant={gradeColor(row.grade) as any}>{row.grade}</Badge>}
              <button type="button" onClick={() => removeRow('o', idx)} className="text-gray-400 hover:text-red-500 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-3">
          <Button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending} className="bg-brand-blue hover:bg-brand-blue/90" size="sm">
            {mutation.isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
            Save O Level
          </Button>
        </div>
      </section>

      {/* A Level */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">A Level Results <span className="text-gray-400 font-normal text-sm">(optional)</span></h4>
          <Button type="button" variant="outline" size="sm" onClick={() => addRow('a')}>
            <Plus className="w-3.5 h-3.5 mr-1" />Add Subject
          </Button>
        </div>
        <div className="space-y-2">
          {aLevel.map((row, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex-1">
                <Select value={row.subject} onValueChange={v => updateRow('a', idx, 'subject', v)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZIMSEC_SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Select value={row.grade} onValueChange={v => updateRow('a', idx, 'grade', v)}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {row.grade && <Badge variant={gradeColor(row.grade) as any}>{row.grade}</Badge>}
              <button type="button" onClick={() => removeRow('a', idx)} className="text-gray-400 hover:text-red-500 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {aLevel.length === 0 && (
            <p className="text-sm text-gray-400 py-3 text-center">No A Level results added yet</p>
          )}
        </div>
        {aLevel.length > 0 && (
          <div className="flex justify-end mt-3">
            <Button type="button" onClick={() => aLevelMutation.mutate()} disabled={aLevelMutation.isPending} className="bg-brand-blue hover:bg-brand-blue/90" size="sm">
              {aLevelMutation.isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Save A Level
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
