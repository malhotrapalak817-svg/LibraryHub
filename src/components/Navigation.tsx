import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Library, Settings, Bell } from 'lucide-react';
import { BorrowedBook } from '@/lib/types';
import { getBooksDueSoon } from '@/lib/libraryUtils';

interface NavigationProps {
  borrowedBooks: BorrowedBook[];
}

export function Navigation({ borrowedBooks }: NavigationProps) {
  const location = useLocation();
  const booksDueSoon = getBooksDueSoon(borrowedBooks);

  const navItems = [
    { path: '/', label: 'Catalog', icon: Library },
    { path: '/borrowed', label: 'Borrowed Books', icon: BookOpen },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border warm-shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <Library className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-foreground">LibraryHub</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Management System</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}

            {/* Notification Bell with Badge */}
            {booksDueSoon.length > 0 && (
              <div className="ml-2 relative">
                <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center animate-pulse-gentle">
                  <Bell className="h-5 w-5 text-warning" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-warning text-warning-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {booksDueSoon.length}
                  </span>
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
