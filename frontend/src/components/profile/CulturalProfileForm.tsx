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
import { Plus, Trash2, Loader2, Music } from 'lucide-react';

const schema = z.object({
  activity: z.string().min(1),
  category: z.enum(['MUSIC', 'DRAMA', 'DANCE', 'ART', 'WRITING', 'DEBATE', 'OTHER']),
  level: z.enum(['SCHOOL', 'DISTRICT', 'NATIONAL', 'INTERNATIONAL']),
  description: z.string().max(300).optional(),
  yearsActive: z.number().int().min(1).max(20).optional(),
});

type FormValues = z.infer<typeof schema>;

const CATEGORIES = ['MUSIC', 'DRAMA', 'DANCE', 'ART', 'WRITING', 'DEBATE', 'OTHER'];
const LEVELS = ['SCHOOL', 'DISTRICT', 'NATIONAL', 'INTERNATIONAL'];
const categoryIcon: Record<string, string> = {
  MUSIC: '🎵', DRAMA: '🎭', DANCE: '💃', ART: '🎨', WRITING: '✍️', DEBATE: '🗣️', OTHER: '⭐',
};

interface Props { profile: any; }

export function CulturalProfileForm({ profile }: Props) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const activities = profile?.culturalActivities ?? [];

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'MUSIC', level: 'SCHOOL' },
  });

  const addMutation = useMutation({
    mutationFn: (data: FormValues) => profileApi.addCulturalActivity(data),
    onSuccess: () => {
      toast.success('Activity added');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      reset();
      setShowForm(false);
    },
    onError: () => toast.error('Failed to add activity'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => profileApi.deleteCulturalActivity(id),
    onSuccess: () => {
      toast.success('Activity removed');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-1">Cultural &amp; Arts</h3>
          <p className="text-sm text-gray-500">Music, drama, debate, art, creative writing</p>
        </div>
        <Button type="button" onClick={() => setShowForm(v => !v)} variant="outline" size="sm">
          {showForm ? 'Cancel' : <><Plus className="w-3.5 h-3.5 mr-1" />Add Activity</>}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(d => addMutation.mutate(d))} className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-200">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Activity Name</Label>
              <Input placeholder="e.g. School Choir, Debate Club" {...register('activity')} />
              {errors.activity && <p className="text-xs text-red-500 mt-1">{errors.activity.message}</p>}
            </div>
            <div>
              <Label>Category</Label>
              <Select defaultValue="MUSIC" onValueChange={v => setValue('category', v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{categoryIcon[c]} {c.charAt(0) + c.slice(1).toLowerCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Level</Label>
              <Select defaultValue="SCHOOL" onValueChange={v => setValue('level', v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LEVELS.map(l => <SelectItem key={l} value={l}>{l.charAt(0) + l.slice(1).toLowerCase()}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Years Active</Label>
              <Input type="number" placeholder="2" {...register('yearsActive', { valueAsNumber: true })} />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea placeholder="Describe your involvement and any achievements..." rows={3} {...register('description')} />
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
            <Music className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No cultural activities added yet</p>
          </div>
        )}
        {activities.map((activity: any) => (
          <div key={activity.id} className="flex items-start justify-between p-4 border border-gray-100 rounded-xl bg-white">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base">{categoryIcon[activity.category] ?? '⭐'}</span>
                <p className="font-semibold text-gray-900 text-sm">{activity.activity}</p>
                <Badge variant="outline" className="text-xs">{activity.level}</Badge>
              </div>
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
