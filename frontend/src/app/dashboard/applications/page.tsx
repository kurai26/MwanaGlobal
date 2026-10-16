'use client';

import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const STATUS_CONFIG: Record<string, { label: string; icon: any; badge: any }> = {
  PENDING: { label: 'Under Review', icon: Clock, badge: 'warning' },
  SHORTLISTED: { label: 'Shortlisted', icon: CheckCircle, badge: 'blue' },
  ACCEPTED: { label: 'Accepted', icon: CheckCircle, badge: 'success' },
  REJECTED: { label: 'Unsuccessful', icon: XCircle, badge: 'destructive' },
};

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Applications</h1>
        <p className="text-gray-500 text-sm mt-1">Track all your submitted applications</p>
      </div>

      <div className="text-center py-20 text-gray-400">
        <FileText className="w-14 h-14 mx-auto mb-3 opacity-20" />
        <p className="font-medium text-gray-500">No applications yet</p>
        <p className="text-sm mt-1">When you apply to opportunities, they will appear here</p>
      </div>
    </div>
  );
}
