'use client';

import { useTheme } from 'next-themes';
import { User } from 'lucide-react';
import { useState } from 'react';

interface AvatarWithFallbackProps {
  src?: string;
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showInitials?: boolean;
  initials?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
};

export function AvatarWithFallback({
  src,
  alt = 'Avatar',
  className = '',
  size = 'md',
  showInitials = false,
  initials = '',
}: AvatarWithFallbackProps) {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);
  const placeholderImage =
    theme === 'dark'
      ? '/placeholder-user.jpg'
      : '/placeholder-user-light.svg';

  // Show placeholder if no src or image failed to load
  const imageSrc = !src || imageError ? placeholderImage : src;
  const isPlaceholder = !src || imageError;

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-slate-700 flex items-center justify-center text-white text-sm font-semibold shadow-md overflow-hidden flex-shrink-0 ${className}`}
    >
      {isPlaceholder && !showInitials ? (
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : isPlaceholder && showInitials && initials ? (
        <span className="text-white">{initials}</span>
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}
