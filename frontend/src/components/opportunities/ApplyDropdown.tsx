'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ExternalLink, Users, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApplyDropdownProps {
  directApplyUrl?: string | null;
  agentName?: string | null;
  agentUrl?: string | null;
  agentContact?: string | null;
  className?: string;
}

export function ApplyDropdown({ directApplyUrl, agentName, agentUrl, agentContact, className }: ApplyDropdownProps) {
  const hasOptions = directApplyUrl || agentUrl || agentContact;
  if (!hasOptions) return null;

  const hasDirect = !!directApplyUrl;
  const hasAgent = !!(agentUrl || agentContact);

  if (hasDirect && !hasAgent) {
    return (
      <a href={directApplyUrl!} target="_blank" rel="noopener noreferrer"
        className={cn('inline-flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors', className)}>
        Apply <ExternalLink className="w-3 h-3" />
      </a>
    );
  }

  if (!hasDirect && hasAgent) {
    const href = agentUrl ?? `mailto:${agentContact}`;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer"
        className={cn('inline-flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors', className)}>
        Contact Agent <Users className="w-3 h-3" />
      </a>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn('inline-flex items-center gap-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors', className)}
          aria-label="Apply options"
        >
          Apply <ChevronDown className="w-3 h-3" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="z-50 min-w-[200px] bg-white rounded-xl border border-gray-100 shadow-lg p-1 text-sm"
        >
          {directApplyUrl && (
            <DropdownMenu.Item asChild>
              <a href={directApplyUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer outline-none text-gray-700">
                <ExternalLink className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                <div>
                  <div className="font-medium">University Application</div>
                  <div className="text-xs text-gray-400">Go to institution&apos;s page</div>
                </div>
              </a>
            </DropdownMenu.Item>
          )}
          {(agentUrl || agentContact) && (
            <DropdownMenu.Item asChild>
              <a href={agentUrl ?? `mailto:${agentContact}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer outline-none text-gray-700">
                <Users className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" />
                <div>
                  <div className="font-medium">{agentName ?? 'Agent'}</div>
                  <div className="text-xs text-gray-400">{agentContact ?? 'Visit agent website'}</div>
                </div>
              </a>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
