import { Bell, X } from 'lucide-react';
import { BorrowedBook } from '@/lib/types';
import { format } from 'date-fns';
import { isDueToday } from '@/lib/libraryUtils';

interface ReminderBannerProps {
  booksDueSoon: BorrowedBook[];
  onDismiss?: () => void;
}

export function ReminderBanner({ booksDueSoon, onDismiss }: ReminderBannerProps) {
  if (booksDueSoon.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-warning/90 to-warning animate-fade-in rounded-lg p-4 mb-6 warm-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Bell className="h-5 w-5 text-warning-foreground animate-pulse-gentle" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-sans font-semibold text-warning-foreground">
            📚 Reminder: Books Due Soon!
          </h3>
          <div className="mt-2 space-y-1">
            {booksDueSoon.map((bb) => (
              <p key={bb.id} className="text-sm text-warning-foreground/90">
                <span className="font-medium">{bb.book.title}</span> is due{' '}
                {isDueToday(bb.dueDate) ? (
                  <span className="font-bold">today</span>
                ) : (
                  <span className="font-bold">tomorrow ({format(bb.dueDate, 'MMM d')})</span>
                )}
                {' - '}Borrowed by {bb.borrowerName}
              </p>
            ))}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-warning-foreground/70 hover:text-warning-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
