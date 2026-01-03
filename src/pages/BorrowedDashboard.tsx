import { useState, useMemo } from 'react';
import { BookOpen, AlertTriangle, XCircle, Clock, DollarSign } from 'lucide-react';
import { BorrowedBookCard } from '@/components/BorrowedBookCard';
import { ReminderBanner } from '@/components/ReminderBanner';
import { borrowedBooks as initialBorrowedBooks, librarySettings } from '@/lib/mockData';
import { getBooksDueSoon, formatCurrency, calculateFine } from '@/lib/libraryUtils';
import { BorrowedBook } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const BorrowedDashboard = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>(initialBorrowedBooks);
  const [showReminder, setShowReminder] = useState(true);
  const [lostDialog, setLostDialog] = useState<BorrowedBook | null>(null);
  const { toast } = useToast();

  const booksDueSoon = getBooksDueSoon(borrowedBooks);

  const stats = useMemo(() => {
    const active = borrowedBooks.filter(b => b.status === 'borrowed');
    const overdue = borrowedBooks.filter(b => b.status === 'overdue');
    const lost = borrowedBooks.filter(b => b.status === 'lost');
    
    const totalFines = overdue.reduce((acc, b) => acc + calculateFine(b.dueDate), 0);
    const totalLostCost = lost.reduce((acc, b) => acc + b.book.replacementCost, 0);

    return {
      active: active.length,
      overdue: overdue.length,
      lost: lost.length,
      dueSoon: booksDueSoon.length,
      totalFines,
      totalLostCost,
    };
  }, [borrowedBooks, booksDueSoon]);

  const handleReturn = (borrowedBook: BorrowedBook) => {
    setBorrowedBooks(prev => 
      prev.map(b => 
        b.id === borrowedBook.id 
          ? { ...b, status: 'returned', returnDate: new Date() }
          : b
      )
    );
    toast({
      title: "Book Returned",
      description: `"${borrowedBook.book.title}" has been marked as returned.`,
    });
  };

  const handleMarkLost = (borrowedBook: BorrowedBook) => {
    setLostDialog(borrowedBook);
  };

  const confirmMarkLost = () => {
    if (lostDialog) {
      setBorrowedBooks(prev => 
        prev.map(b => 
          b.id === lostDialog.id 
            ? { ...b, status: 'lost', fineAmount: b.book.replacementCost }
            : b
        )
      );
      toast({
        title: "Book Marked as Lost",
        description: `"${lostDialog.book.title}" has been marked as lost. Replacement cost: ${formatCurrency(lostDialog.book.replacementCost, librarySettings.currency)}`,
        variant: "destructive",
      });
      setLostDialog(null);
    }
  };

  const activeBooks = borrowedBooks.filter(b => b.status === 'borrowed');
  const overdueBooks = borrowedBooks.filter(b => b.status === 'overdue');
  const lostBooks = borrowedBooks.filter(b => b.status === 'lost');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-background to-secondary/50 py-12 border-b border-border">
        <div className="container mx-auto px-4">
          {/* Reminder Banner */}
          {showReminder && booksDueSoon.length > 0 && (
            <ReminderBanner
              booksDueSoon={booksDueSoon}
              onDismiss={() => setShowReminder(false)}
            />
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center warm-shadow">
              <BookOpen className="h-7 w-7 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Borrowed Books
              </h1>
              <p className="text-muted-foreground mt-1">
                Track borrowings, fines, and returns
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Active Loans', value: stats.active, icon: BookOpen, color: 'text-primary' },
              { label: 'Due Soon', value: stats.dueSoon, icon: Clock, color: 'text-warning' },
              { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'text-destructive' },
              { label: 'Lost Books', value: stats.lost, icon: XCircle, color: 'text-destructive' },
              { label: 'Total Fines', value: formatCurrency(stats.totalFines, librarySettings.currency), icon: DollarSign, color: 'text-destructive' },
              { label: 'Lost Value', value: formatCurrency(stats.totalLostCost, librarySettings.currency), icon: DollarSign, color: 'text-destructive' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-lg p-4 warm-shadow border border-border/50"
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="active" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Active ({activeBooks.length})
              </TabsTrigger>
              <TabsTrigger value="overdue" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Overdue ({overdueBooks.length})
              </TabsTrigger>
              <TabsTrigger value="lost" className="gap-2">
                <XCircle className="h-4 w-4" />
                Lost ({lostBooks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-0">
              {activeBooks.length === 0 ? (
                <EmptyState message="No active loans" />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeBooks.map((bb, index) => (
                    <div key={bb.id} style={{ animationDelay: `${index * 50}ms` }}>
                      <BorrowedBookCard
                        borrowedBook={bb}
                        onReturn={handleReturn}
                        onMarkLost={handleMarkLost}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="overdue" className="mt-0">
              {overdueBooks.length === 0 ? (
                <EmptyState message="No overdue books" />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {overdueBooks.map((bb, index) => (
                    <div key={bb.id} style={{ animationDelay: `${index * 50}ms` }}>
                      <BorrowedBookCard
                        borrowedBook={{ ...bb, fineAmount: calculateFine(bb.dueDate) }}
                        onReturn={handleReturn}
                        onMarkLost={handleMarkLost}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="lost" className="mt-0">
              {lostBooks.length === 0 ? (
                <EmptyState message="No lost books" />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {lostBooks.map((bb, index) => (
                    <div key={bb.id} style={{ animationDelay: `${index * 50}ms` }}>
                      <BorrowedBookCard borrowedBook={bb} />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Lost Confirmation Dialog */}
      <AlertDialog open={!!lostDialog} onOpenChange={() => setLostDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Book as Lost?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark "{lostDialog?.book.title}" as lost. The borrower ({lostDialog?.borrowerName}) will be charged the replacement cost of{' '}
              <span className="font-bold text-destructive">
                {formatCurrency(lostDialog?.book.replacementCost || 0, librarySettings.currency)}
              </span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmMarkLost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Lost
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
      <h3 className="font-serif text-xl text-foreground mb-2">{message}</h3>
      <p className="text-muted-foreground">
        All caught up!
      </p>
    </div>
  );
}

export default BorrowedDashboard;
