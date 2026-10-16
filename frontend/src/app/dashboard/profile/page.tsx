'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User, BookOpen, Users, Trophy, Music, FileText, ChevronRight, Check, Camera } from 'lucide-react';
import { profileApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm';
import { AcademicProfileForm } from '@/components/profile/AcademicProfileForm';
import { LeadershipProfileForm } from '@/components/profile/LeadershipProfileForm';
import { SportProfileForm } from '@/components/profile/SportProfileForm';
import { CulturalProfileForm } from '@/components/profile/CulturalProfileForm';
import { DocumentsForm } from '@/components/profile/DocumentsForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';

const sections = [
  { id: 'personal', label: 'Personal Info', icon: User, description: 'Your basic information' },
  { id: 'academic', label: 'Academic Results', icon: BookOpen, description: 'O & A Level results' },
  { id: 'leadership', label: 'Leadership', icon: Users, description: 'Roles & activities' },
  { id: 'sports', label: 'Sports', icon: Trophy, description: 'Athletic achievements' },
  { id: 'cultural', label: 'Cultural', icon: Music, description: 'Arts & culture' },
  { id: 'documents', label: 'Documents', icon: FileText, description: 'Recommendations & transcripts' },
];

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState('personal');
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => profileApi.getMyProfile().then(r => r.data.data),
  });

  const profile = data;
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();

  // Profile completeness check per section
  const sectionComplete: Record<string, boolean> = {
    personal: !!(profile?.country && profile?.school && profile?.biography),
    academic: (profile?.oLevelResults?.length ?? 0) > 0,
    leadership: true,
    sports: true,
    cultural: true,
    documents: true,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile header card */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-brand-blue to-brand-blue-light" />
        <div className="px-6 pb-6 -mt-12">
          <div className="flex items-end justify-between mb-4">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                <AvatarImage src={profile?.profilePhotoUrl} />
                <AvatarFallback className="bg-brand-blue text-white text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-brand-blue rounded-full flex items-center justify-center border-2 border-white hover:bg-brand-blue-light transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            {profile?.overallScore && (
              <div className="flex items-center gap-2 bg-brand-blue/10 rounded-xl px-4 py-2">
                <span className="text-brand-blue font-display font-bold text-2xl">{profile.overallScore}</span>
                <div>
                  <p className="text-brand-blue font-semibold text-sm">Overall Score</p>
                  <p className="text-gray-400 text-xs">Out of 100</p>
                </div>
              </div>
            )}
          </div>
          <h2 className="text-xl font-display font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
          <p className="text-gray-500 text-sm">{profile?.school} · {profile?.country}</p>
          {profile?.academicScore && (
            <div className="flex gap-4 mt-3">
              <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                Academic: {profile.academicScore}/100
              </span>
              {profile.distinctions !== undefined && (
                <span className="text-xs bg-gold-50 text-brand-gold-dark px-2.5 py-1 rounded-full font-medium bg-yellow-50">
                  {profile.distinctions} Distinctions
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Section nav */}
        <div className="lg:col-span-1 space-y-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all',
                activeSection === section.id
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'bg-white border border-gray-100 text-gray-600 hover:border-brand-blue/30 hover:text-brand-blue'
              )}
            >
              <section.icon className="w-4.5 h-4.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{section.label}</p>
                <p className={cn('text-xs mt-0.5', activeSection === section.id ? 'text-white/70' : 'text-gray-400')}>
                  {section.description}
                </p>
              </div>
              {sectionComplete[section.id] && activeSection !== section.id && (
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
              )}
              {activeSection === section.id && <ChevronRight className="w-4 h-4 opacity-60 flex-shrink-0" />}
            </button>
          ))}
        </div>

        {/* Form area */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6">
          {activeSection === 'personal' && <PersonalInfoForm profile={profile} />}
          {activeSection === 'academic' && <AcademicProfileForm profile={profile} />}
          {activeSection === 'leadership' && <LeadershipProfileForm profile={profile} />}
          {activeSection === 'sports' && <SportProfileForm profile={profile} />}
          {activeSection === 'cultural' && <CulturalProfileForm profile={profile} />}
          {activeSection === 'documents' && <DocumentsForm profile={profile} />}
        </div>
      </div>
    </div>
  );
}
