import { differenceInDays, isTomorrow, isPast, isToday } from 'date-fns';
import { BorrowedBook, LibrarySettings } from './types';
import { librarySettings } from './mockData';

export function calculateFine(dueDate: Date, settings: LibrarySettings = librarySettings): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  const daysOverdue = differenceInDays(today, due);
  
  if (daysOverdue <= 0) return 0;
  
  return Math.round(daysOverdue * settings.finePerDay * 100) / 100;
}

export function isDueTomorrow(dueDate: Date): boolean {
  return isTomorrow(dueDate);
}

export function isDueToday(dueDate: Date): boolean {
  return isToday(dueDate);
}

export function isOverdue(dueDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  return isPast(due) && !isToday(dueDate);
}

export function getDaysUntilDue(dueDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  return differenceInDays(due, today);
}

export function getBooksDueSoon(borrowedBooks: BorrowedBook[]): BorrowedBook[] {
  return borrowedBooks.filter(
    (bb) => bb.status === 'borrowed' && (isDueTomorrow(bb.dueDate) || isDueToday(bb.dueDate))
  );
}

export function formatCurrency(amount: number, currency: string = '$'): string {
  return `${currency}${amount.toFixed(2)}`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'available':
      return 'bg-available text-available-foreground';
    case 'borrowed':
      return 'bg-borrowed text-borrowed-foreground';
    case 'overdue':
      return 'bg-overdue text-overdue-foreground';
    case 'lost':
      return 'bg-lost text-lost-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
}
