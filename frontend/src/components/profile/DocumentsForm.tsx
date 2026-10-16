'use client';

import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { profileApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Trash2, Loader2, ExternalLink, Lock } from 'lucide-react';

const DOC_TYPES = [
  { value: 'TRANSCRIPT', label: 'Academic Transcript', description: 'Official school transcripts' },
  { value: 'RECOMMENDATION', label: 'Recommendation Letter', description: 'From teachers or counselors' },
  { value: 'CERTIFICATE', label: 'Certificate / Award', description: 'Academic or activity certificates' },
  { value: 'IDENTITY', label: 'Identity Document', description: 'ID, passport (private)' },
  { value: 'OTHER', label: 'Other Document', description: 'Any other relevant document' },
];

interface Props { profile: any; }

export function DocumentsForm({ profile }: Props) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState('TRANSCRIPT');
  const [uploading, setUploading] = useState(false);

  const documents = profile?.documents ?? [];

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', selectedType);
      return profileApi.addDocument(formData);
    },
    onSuccess: () => {
      toast.success('Document uploaded');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setUploading(false);
    },
    onError: () => {
      toast.error('Upload failed');
      setUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => profileApi.deleteDocument(id),
    onSuccess: () => {
      toast.success('Document removed');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10MB');
      return;
    }
    setUploading(true);
    uploadMutation.mutate(file);
    e.target.value = '';
  };

  const docsByType = DOC_TYPES.map(dt => ({
    ...dt,
    docs: documents.filter((d: any) => d.type === dt.value),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-1">Documents</h3>
        <p className="text-sm text-gray-500">Transcripts, letters, certificates — max 10MB per file</p>
      </div>

      {/* Upload area */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-brand-blue/40 transition-colors">
        <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.png" onChange={handleFileChange} />
        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-3">Upload a document</p>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {DOC_TYPES.map(dt => (
            <button
              key={dt.value}
              type="button"
              onClick={() => setSelectedType(dt.value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                selectedType === dt.value
                  ? 'bg-brand-blue text-white border-brand-blue'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue/40'
              }`}
            >
              {dt.label}
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Uploading...</>
          ) : (
            <><Upload className="w-3.5 h-3.5 mr-1.5" />Choose File</>
          )}
        </Button>
        <p className="text-xs text-gray-400 mt-2">PDF, DOC, JPG or PNG</p>
      </div>

      {/* Document list */}
      <div className="space-y-4">
        {docsByType.filter(dt => dt.docs.length > 0).map(dt => (
          <div key={dt.value}>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">{dt.label}</h4>
            <div className="space-y-2">
              {dt.docs.map((doc: any) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-white">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName ?? 'Document'}</p>
                    <p className="text-xs text-gray-400">{doc.fileSize ? `${Math.round(doc.fileSize / 1024)}KB` : ''}</p>
                  </div>
                  {doc.isPrivate && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <Lock className="w-3 h-3" />
                      <span className="text-xs">Private</span>
                    </div>
                  )}
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-brand-blue transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => deleteMutation.mutate(doc.id)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {documents.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-4">No documents uploaded yet</p>
        )}
      </div>
    </div>
  );
}
