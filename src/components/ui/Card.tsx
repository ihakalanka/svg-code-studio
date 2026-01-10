/**
 * Card Component
 * Reusable card container
 */

import { memo, type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = memo(function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-700 p-6 ${className}`}>
      {children}
    </div>
  );
});
