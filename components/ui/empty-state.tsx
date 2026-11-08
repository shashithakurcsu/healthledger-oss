import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from './button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  secondaryActionLabel,
  secondaryActionHref,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
        {description}
      </p>
      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {actionLabel && actionHref && (
            <Link href={actionHref}>
              <Button className="bg-teal-600 hover:bg-teal-700">
                {actionLabel}
              </Button>
            </Link>
          )}
          {actionLabel && actionOnClick && (
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={actionOnClick}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && secondaryActionHref && (
            <Link href={secondaryActionHref}>
              <Button variant="outline">{secondaryActionLabel}</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
