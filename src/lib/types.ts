export type Department = 
  | 'Computer Science & IT'
  | 'Electronics & ECE'
  | 'Electrical'
  | 'Civil'
  | 'Mechanical'
  | 'Mathematics';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  coverColor: string;
  replacementCost: number;
  department: Department;
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  book: Book;
  borrowerName: string;
  borrowerId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'borrowed' | 'returned' | 'overdue' | 'lost';
  fineAmount: number;
}

export interface LibrarySettings {
  finePerDay: number;
  currency: string;
  borrowPeriodDays: number;
}

export type BookStatus = 'available' | 'borrowed' | 'overdue' | 'lost';
