'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Header } from './header';
import type { Profile } from '@/types';

interface DashboardShellProps {
  children: React.ReactNode;
  profile: Profile | null;
}

export function DashboardShell({ children, profile }: DashboardShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:hidden',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Sidebar isCollapsed={false} onToggle={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main content */}
      <div
        className={cn(
          'transition-all duration-300 lg:ml-64',
          isCollapsed && 'lg:ml-16'
        )}
      >
        <Header
          profile={profile}
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
