import { useState, useMemo } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BookCard } from '@/components/BookCard';
import { ReminderBanner } from '@/components/ReminderBanner';
import { books, borrowedBooks } from '@/lib/mockData';
import { getBooksDueSoon } from '@/lib/libraryUtils';
import { Book } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [showReminder, setShowReminder] = useState(true);
  const { toast } = useToast();

  const booksDueSoon = getBooksDueSoon(borrowedBooks);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm) ||
        book.shelfLocation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAvailability =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && book.availableCopies > 0) ||
        (availabilityFilter === 'unavailable' && book.availableCopies === 0);

      return matchesSearch && matchesAvailability;
    });
  }, [searchTerm, availabilityFilter]);

  const handleBorrow = (book: Book) => {
    toast({
      title: "Borrow Request Submitted",
      description: `Request to borrow "${book.title}" has been submitted. Please visit the front desk.`,
    });
  };

  const stats = useMemo(() => ({
    total: books.length,
    available: books.filter(b => b.availableCopies > 0).length,
    totalCopies: books.reduce((acc, b) => acc + b.totalCopies, 0),
    availableCopies: books.reduce((acc, b) => acc + b.availableCopies, 0),
  }), []);

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
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center warm-shadow">
              <BookOpen className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Book Catalog
              </h1>
              <p className="text-muted-foreground mt-1">
                Browse and discover our collection
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Titles', value: stats.total },
              { label: 'Available Titles', value: stats.available },
              { label: 'Total Copies', value: stats.totalCopies },
              { label: 'Available Copies', value: stats.availableCopies },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-lg p-4 warm-shadow border border-border/50"
              >
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, ISBN, or shelf..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-card border-border">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Books</SelectItem>
                <SelectItem value="available">Available Only</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Book Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-foreground mb-2">No books found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book, index) => (
                <div
                  key={book.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <BookCard book={book} onBorrow={handleBorrow} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Catalog;
