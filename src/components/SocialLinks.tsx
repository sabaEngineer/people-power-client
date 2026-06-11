import type { MouseEvent } from 'react';
import { normalizeUrl } from '../lib/url';

interface SocialLinksProps {
  socialUrl?: string | null;
  className?: string;
  onLinkClick?: (e: MouseEvent) => void;
}

function socialLabel(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes('facebook.com') || lower.includes('fb.com')) return 'Facebook';
  if (lower.includes('instagram.com')) return 'Instagram';
  if (lower.includes('linkedin.com')) return 'LinkedIn';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'X';
  return 'Profile';
}

export default function SocialLinks({
  socialUrl,
  className = '',
  onLinkClick,
}: SocialLinksProps) {
  if (!socialUrl?.trim()) return null;

  const href = normalizeUrl(socialUrl);

  return (
    <div className={className}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onLinkClick}
        className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
      >
        {socialLabel(socialUrl)}
      </a>
    </div>
  );
}
