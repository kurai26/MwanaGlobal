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
import { Plus, Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

const schema = z.object({
  role: z.string().min(1, 'Role is required'),
  organisation: z.string().min(1, 'Organisation is required'),
  startYear: z.number().int().min(2000).max(2030),
  endYear: z.number().int().min(2000).max(2030).optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().max(300).optional(),
  impactLevel: z.enum(['SCHOOL', 'DISTRICT', 'NATIONAL', 'INTERNATIONAL']),
});

type FormValues = z.infer<typeof schema>;

const IMPACT_LEVELS = ['SCHOOL', 'DISTRICT', 'NATIONAL', 'INTERNATIONAL'];
const impactBadge: Record<string, any> = {
  SCHOOL: 'outline',
  DISTRICT: 'blue',
  NATIONAL: 'warning',
  INTERNATIONAL: 'success',
};

interface Props { profile: any; }

export function LeadershipProfileForm({ profile }: Props) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const activities = profile?.leadershipActivities ?? [];

  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { impactLevel: 'SCHOOL', startYear: new Date().getFullYear(), isCurrent: false },
  });

  const addMutation = useMutation({
    mutationFn: (data: FormValues) => profileApi.addLeadershipActivity(data),
    onSuccess: () => {
      toast.success('Activity added');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      reset();
      setShowForm(false);
    },
    onError: () => toast.error('Failed to add activity'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => profileApi.deleteLeadershipActivity(id),
    onSuccess: () => {
      toast.success('Activity removed');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-1">Leadership</h3>
          <p className="text-sm text-gray-500">Roles, clubs, prefect positions, community work</p>
        </div>
        <Button type="button" onClick={() => setShowForm(v => !v)} variant="outline" size="sm">
          {showForm ? <ChevronUp className="w-3.5 h-3.5 mr-1" /> : <Plus className="w-3.5 h-3.5 mr-1" />}
          {showForm ? 'Cancel' : 'Add Activity'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(d => addMutation.mutate(d))} className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-200">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Role / Title</Label>
              <Input placeholder="e.g. Head Prefect" {...register('role')} />
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
            </div>
            <div>
              <Label>Organisation / School</Label>
              <Input placeholder="e.g. Harare High School" {...register('organisation')} />
              {errors.organisation && <p className="text-xs text-red-500 mt-1">{errors.organisation.message}</p>}
            </div>
            <div>
              <Label>Start Year</Label>
              <Input type="number" placeholder="2022" {...register('startYear', { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Impact Level</Label>
              <Select defaultValue="SCHOOL" onValueChange={v => setValue('impactLevel', v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {IMPACT_LEVELS.map(l => <SelectItem key={l} value={l}>{l.charAt(0) + l.slice(1).toLowerCase()}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Description <span className="text-gray-400 font-normal text-xs">({watch('description')?.length ?? 0}/300)</span></Label>
            <Textarea placeholder="Describe your responsibilities and achievements..." rows={3} {...register('description')} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={addMutation.isPending} className="bg-brand-blue hover:bg-brand-blue/90" size="sm">
              {addMutation.isPending && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Add Activity
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {activities.length === 0 && !showForm && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No leadership activities added yet</p>
            <p className="text-xs mt-1">Add prefect roles, clubs, community service, and more</p>
          </div>
        )}
        {activities.map((activity: any) => (
          <div key={activity.id} className="flex items-start justify-between p-4 border border-gray-100 rounded-xl bg-white">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900 text-sm">{activity.role}</p>
                <Badge variant={impactBadge[activity.impactLevel] ?? 'outline'} className="text-xs">
                  {activity.impactLevel}
                </Badge>
              </div>
              <p className="text-gray-500 text-xs mt-0.5">{activity.organisation} · {activity.startYear}{activity.isCurrent ? ' – Present' : activity.endYear ? ` – ${activity.endYear}` : ''}</p>
              {activity.description && <p className="text-gray-600 text-xs mt-1.5">{activity.description}</p>}
            </div>
            <button onClick={() => deleteMutation.mutate(activity.id)} className="ml-3 p-1.5 text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
