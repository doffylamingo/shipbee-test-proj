import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CustomerWidget from '@/components/widget/CustomerWidget';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer');

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Button
          variant={view === 'customer' ? 'default' : 'outline'}
          onClick={() => setView('customer')}
        >
          Customer View
        </Button>
        <Button
          variant={view === 'admin' ? 'default' : 'outline'}
          onClick={() => setView('admin')}
        >
          Admin Dashboard
        </Button>
      </div>

      {view === 'customer' ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <CustomerWidget />
        </div>
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
}