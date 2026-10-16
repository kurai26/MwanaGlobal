'use client';

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
import { Loader2 } from 'lucide-react';

const schema = z.object({
  country: z.string().min(1, 'Country is required'),
  city: z.string().optional(),
  school: z.string().min(1, 'School is required'),
  biography: z.string().max(500, 'Bio must be under 500 characters').optional(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const COUNTRIES = [
  'Zimbabwe', 'South Africa', 'Kenya', 'Nigeria', 'Ghana', 'Uganda', 'Tanzania',
  'Zambia', 'Botswana', 'Namibia', 'Rwanda', 'Ethiopia', 'Senegal', 'Côte d\'Ivoire',
  'Cameroon', 'Egypt', 'Morocco', 'Tunisia', 'Other'
];

interface Props {
  profile: any;
}

export function PersonalInfoForm({ profile }: Props) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: profile?.country ?? '',
      city: profile?.city ?? '',
      school: profile?.school ?? '',
      biography: profile?.biography ?? '',
      phoneNumber: profile?.phoneNumber ?? '',
      dateOfBirth: profile?.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
      gender: profile?.gender ?? '',
      nationality: profile?.nationality ?? '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormValues) => profileApi.updatePersonalInfo(data),
    onSuccess: () => {
      toast.success('Personal info updated');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: () => toast.error('Failed to save changes'),
  });

  return (
    <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-1">Personal Information</h3>
        <p className="text-sm text-gray-500">Tell institutions about yourself</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country</Label>
          <Select defaultValue={profile?.country} onValueChange={v => setValue('country', v, { shouldDirty: true })}>
            <SelectTrigger id="country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
        </div>

        <div>
          <Label htmlFor="city">City / Town</Label>
          <Input id="city" placeholder="e.g. Harare" {...register('city')} />
        </div>

        <div>
          <Label htmlFor="nationality">Nationality</Label>
          <Input id="nationality" placeholder="e.g. Zimbabwean" {...register('nationality')} />
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select defaultValue={profile?.gender} onValueChange={v => setValue('gender', v, { shouldDirty: true })}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" placeholder="+263 77 123 4567" {...register('phoneNumber')} />
        </div>
      </div>

      <div>
        <Label htmlFor="school">Current School / Institution</Label>
        <Input id="school" placeholder="e.g. Harare High School" {...register('school')} />
        {errors.school && <p className="text-xs text-red-500 mt-1">{errors.school.message}</p>}
      </div>

      <div>
        <Label htmlFor="biography">
          Biography
          <span className="text-gray-400 font-normal ml-1">({watch('biography')?.length ?? 0}/500)</span>
        </Label>
        <Textarea
          id="biography"
          rows={4}
          placeholder="Tell us about yourself, your passions, and your goals..."
          {...register('biography')}
        />
        {errors.biography && <p className="text-xs text-red-500 mt-1">{errors.biography.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending || !isDirty} className="bg-brand-blue hover:bg-brand-blue/90">
          {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
