import { BorrowedBook } from '@/lib/types';
import { format, differenceInDays } from 'date-fns';
import { Clock, AlertTriangle, XCircle, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, isOverdue, isDueTomorrow, isDueToday } from '@/lib/libraryUtils';
import { librarySettings } from '@/lib/mockData';

interface BorrowedBookCardProps {
  borrowedBook: BorrowedBook;
  onMarkLost?: (borrowedBook: BorrowedBook) => void;
  onReturn?: (borrowedBook: BorrowedBook) => void;
}

export function BorrowedBookCard({ borrowedBook, onMarkLost, onReturn }: BorrowedBookCardProps) {
  const { book, borrowerName, borrowerId, borrowDate, dueDate, status, fineAmount } = borrowedBook;
  
  const daysUntilDue = differenceInDays(dueDate, new Date());
  const daysOverdue = Math.abs(daysUntilDue);
  
  const getStatusBadge = () => {
    switch (status) {
      case 'overdue':
        return (
          <Badge className="bg-overdue text-overdue-foreground">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Overdue ({daysOverdue} days)
          </Badge>
        );
      case 'lost':
        return (
          <Badge className="bg-lost text-lost-foreground">
            <XCircle className="h-3 w-3 mr-1" />
            Lost
          </Badge>
        );
      case 'borrowed':
        if (isDueToday(dueDate)) {
          return (
            <Badge className="bg-warning text-warning-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Due Today!
            </Badge>
          );
        }
        if (isDueTomorrow(dueDate)) {
          return (
            <Badge className="bg-warning text-warning-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Due Tomorrow
            </Badge>
          );
        }
        return (
          <Badge className="bg-borrowed text-borrowed-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {daysUntilDue} days left
          </Badge>
        );
      default:
        return <Badge variant="secondary">Returned</Badge>;
    }
  };

  const isDueSoon = isDueTomorrow(dueDate) || isDueToday(dueDate);
  const cardBorderClass = status === 'overdue' || status === 'lost' 
    ? 'border-l-4 border-l-destructive' 
    : isDueSoon 
    ? 'border-l-4 border-l-warning' 
    : '';

  return (
    <Card className={`overflow-hidden warm-shadow hover:warm-shadow-lg transition-all duration-300 animate-slide-up ${cardBorderClass}`}>
      <div className="flex gap-4 p-4">
        {/* Book Spine Visual */}
        <div
          className={`${book.coverColor} w-3 h-full min-h-[160px] rounded-sm flex-shrink-0`}
        />
        
        {/* Book & Borrow Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-bold text-card-foreground">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                by {book.author}
              </p>
            </div>
            {getStatusBadge()}
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Borrower:</span> {borrowerName}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">ID:</span> {borrowerId}
              </p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground">Borrowed:</span>{' '}
                {format(borrowDate, 'MMM d, yyyy')}
              </p>
              <p className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground">Due:</span>{' '}
                {format(dueDate, 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* Fine or Replacement Cost */}
          {(status === 'overdue' || status === 'lost') && (
            <div className="mt-3 p-3 bg-destructive/10 rounded-md">
              <p className="text-sm font-medium text-destructive">
                {status === 'lost' ? (
                  <>
                    Replacement Cost: <span className="font-bold">{formatCurrency(book.replacementCost, librarySettings.currency)}</span>
                  </>
                ) : (
                  <>
                    Fine Accrued: <span className="font-bold">{formatCurrency(fineAmount, librarySettings.currency)}</span>
                    <span className="text-xs ml-2 text-muted-foreground">
                      ({formatCurrency(librarySettings.finePerDay, librarySettings.currency)}/day)
                    </span>
                  </>
                )}
              </p>
            </div>
          )}

          {/* Actions */}
          {status !== 'lost' && status !== 'returned' && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {onReturn && (
                <Button
                  size="sm"
                  onClick={() => onReturn(borrowedBook)}
                  className="bg-success text-success-foreground hover:bg-success/90"
                >
                  Mark Returned
                </Button>
              )}
              {onMarkLost && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onMarkLost(borrowedBook)}
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  Mark as Lost
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
