import { Settings as SettingsIcon, IndianRupee, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { librarySettings } from '@/lib/mockData';

const Fine = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary via-background to-secondary/50 py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center warm-shadow">
              <SettingsIcon className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                Library Policy
              </h1>
              <p className="text-muted-foreground mt-1">
                Current library rules and rates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="warm-shadow animate-slide-up">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Current Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <IndianRupee className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Fine Per Day</span>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  {librarySettings.currency} {librarySettings.finePerDay}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Borrow Period</span>
                </div>
                <span className="text-lg font-semibold text-foreground">
                  {librarySettings.borrowPeriodDays} days
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 warm-shadow animate-slide-up bg-secondary/30" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="font-serif text-lg">About This System</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong className="text-foreground">LibraryHub</strong> is a library management system designed for small to medium libraries.
              </p>
              <p>
                Features include book catalog management, borrowing tracking, automatic fine calculation, and due date reminders.
              </p>
              <p className="pt-2 text-xs">
                Version 1.0.0 • Built with React & Tailwind CSS
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Settings;
