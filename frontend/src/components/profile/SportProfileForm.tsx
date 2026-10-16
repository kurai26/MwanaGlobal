'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { profileApi } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Loader2, Trophy } from 'lucide-react';

const schema = z.object({
  sport: z.string().min(1),
  position: z.string().optional(),
  level: z.enum(['SCHOOL', 'DISTRICT', 'PROVINCIAL', 'NATIONAL', 'INTERNATIONAL']),
  achievements: z.string().max(500).optional(),
  yearsPlayed: z.number().int().min(1).max(20).optional(),
  isActive: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

const SPORTS = [
  'Football (Soccer)', 'Rugby', 'Cricket', 'Basketball', 'Netball', 'Athletics / Track & Field',
  'Swimming', 'Tennis', 'Volleyball', 'Hockey', 'Boxing', 'Cycling', 'Chess',
  'Table Tennis', 'Badminton', 'Gymnastics', 'Martial Arts', 'Other',
];

const LEVELS = ['SCHOOL', 'DISTRICT', 'PROVINCIAL', 'NATIONAL', 'INTERNATIONAL'];
const levelBadge: Record<string, any> = {
  SCHOOL: 'outline', DISTRICT: 'blue', PROVINCIAL: 'warning', NATIONAL: 'success', INTERNATIONAL: 'default',
};

interface Props { profile: any; }

export function SportProfileForm({ profile }: Props) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const sports = profile?.sportProfiles ?? [];

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { level: 'SCHOOL', isActive: true },
  });

  const addMutation = useMutation({
    mutationFn: (data: FormValues) => profileApi.addSportProfile(data),
    onSuccess: () => {
      toast.success('Sport added');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      reset();
      setShowForm(false);
    },
    onError: () => toast.error('Failed to add sport'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => profileApi.deleteSportProfile(id),
    onSuccess: () => {
      toast.success('Sport removed');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-1">Sports</h3>
          <p className="text-sm text-gray-500">Athletic achievements and sporting activities</p>
        </div>
        <Button type="button" onClick={() => setShowForm(v => !v)} variant="outline" size="sm">
          {showForm ? 'Cancel' : <><Plus className="w-3.5 h-3.5 mr-1" />Add Sport</>}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(d => addMutation.mutate(d))} className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-200">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Sport</Label>
              <Select onValueChange={v => setValue('sport', v)}>
                <SelectTrigger><SelectValue placeholder="Select sport" /></SelectTrigger>
                <SelectContent>
                  {SPORTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.sport && <p className="text-xs text-red-500 mt-1">{errors.sport.message}</p>}
            </div>
            <div>
              <Label>Position / Discipline</Label>
              <Input placeholder="e.g. Striker, Sprinter" {...register('position')} />
            </div>
            <div>
              <Label>Highest Level</Label>
              <Select defaultValue="SCHOOL" onValueChange={v => setValue('level', v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LEVELS.map(l => <SelectItem key={l} value={l}>{l.charAt(0) + l.slice(1).toLowerCase()}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Years Played</Label>
              <Input type="number" placeholder="3" {...register('yearsPlayed', { valueAsNumber: true })} />
            </div>
          </div>
          <div>
            <Label>Achievements &amp; Honours</Label>
            <Textarea placeholder="e.g. Provincial champion 2023, Zimbabwe U-17 trials..." rows={3} {...register('achievements')} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={addMutation.isPending} className="bg-brand-blue hover:bg-brand-blue/90" size="sm">
              {addMutation.isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Add Sport
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {sports.length === 0 && !showForm && (
          <div className="text-center py-8 text-gray-400">
            <Trophy className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No sports added yet</p>
          </div>
        )}
        {sports.map((sport: any) => (
          <div key={sport.id} className="flex items-start justify-between p-4 border border-gray-100 rounded-xl bg-white">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900 text-sm">{sport.sport}</p>
                <Badge variant={levelBadge[sport.level] ?? 'outline'} className="text-xs">{sport.level}</Badge>
                {sport.isActive && <Badge variant="success" className="text-xs">Active</Badge>}
              </div>
              {sport.position && <p className="text-gray-500 text-xs mt-0.5">{sport.position}</p>}
              {sport.achievements && <p className="text-gray-600 text-xs mt-1.5">{sport.achievements}</p>}
            </div>
            <button onClick={() => deleteMutation.mutate(sport.id)} className="ml-3 p-1.5 text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
