import { Book } from '@/lib/types';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface BookCardProps {
  book: Book;
  onBorrow?: (book: Book) => void;
}

export function BookCard({ book, onBorrow }: BookCardProps) {
  const isAvailable = book.availableCopies > 0;

  return (
    <Card className="group overflow-hidden warm-shadow hover:warm-shadow-lg transition-all duration-300 animate-slide-up">
      <div className="flex gap-4 p-4">
        {/* Book Spine Visual */}
        <div
          className={`${book.coverColor} w-4 h-full min-h-[140px] rounded-sm flex-shrink-0 transition-transform group-hover:translate-x-1`}
        />
        
        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-serif text-lg font-bold text-card-foreground truncate group-hover:text-primary transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                by {book.author}
              </p>
            </div>
            <Badge
              variant={isAvailable ? 'default' : 'secondary'}
              className={isAvailable ? 'bg-available text-available-foreground' : 'bg-muted text-muted-foreground'}
            >
              {isAvailable ? 'Available' : 'Unavailable'}
            </Badge>
          </div>

          <div className="mt-3 space-y-2 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">ISBN:</span> {book.isbn}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">Copies:</span>{' '}
                <span className={isAvailable ? 'text-success' : 'text-destructive'}>
                  {book.availableCopies}
                </span>
                /{book.totalCopies}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="font-medium text-foreground">Shelf {book.shelfLocation}</span>
              </span>
            </div>
          </div>

          {isAvailable && onBorrow && (
            <button
              onClick={() => onBorrow(book)}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Borrow Book
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
