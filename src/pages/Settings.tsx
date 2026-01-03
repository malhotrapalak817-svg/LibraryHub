import { useState } from 'react';
import { Settings as SettingsIcon, DollarSign, Calendar, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { librarySettings } from '@/lib/mockData';

const Settings = () => {
  const [settings, setSettings] = useState({
    finePerDay: librarySettings.finePerDay,
    currency: librarySettings.currency,
    borrowPeriodDays: librarySettings.borrowPeriodDays,
  });
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Settings Saved",
      description: "Library settings have been updated successfully.",
    });
  };

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
                Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                Configure library policies and preferences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Settings Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="warm-shadow animate-slide-up">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Fine Configuration</CardTitle>
              <CardDescription>
                Set the daily fine rate for overdue books
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="finePerDay" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Fine Per Day
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {settings.currency}
                    </span>
                    <Input
                      id="finePerDay"
                      type="number"
                      step="0.01"
                      min="0"
                      value={settings.finePerDay}
                      onChange={(e) => setSettings(s => ({ ...s, finePerDay: parseFloat(e.target.value) || 0 }))}
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Amount charged per day for overdue books
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Currency Symbol
                  </Label>
                  <Input
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => setSettings(s => ({ ...s, currency: e.target.value }))}
                    maxLength={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Symbol displayed before amounts
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="borrowPeriod" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Default Borrow Period
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="borrowPeriod"
                    type="number"
                    min="1"
                    max="90"
                    value={settings.borrowPeriodDays}
                    onChange={(e) => setSettings(s => ({ ...s, borrowPeriodDays: parseInt(e.target.value) || 14 }))}
                    className="max-w-24"
                  />
                  <span className="text-muted-foreground">days</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Default number of days books can be borrowed
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
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
