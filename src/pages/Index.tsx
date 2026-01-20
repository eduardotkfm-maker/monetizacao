import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, ModuleId } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { SquadPage } from '@/components/dashboard/SquadPage';
import { AdminPanel } from '@/components/dashboard/AdminPanel';

const Index = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'eagles':
        return <SquadPage squadSlug="eagles" />;
      case 'alcateia':
        return <SquadPage squadSlug="alcateia" />;
      case 'sharks':
        return <SquadPage squadSlug="sharks" />;
      case 'admin':
        return <AdminPanel />;
      case 'sdrs':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Módulo SDRs</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">Relatórios</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
      />
      
      <div className="flex-1 flex flex-col md:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
