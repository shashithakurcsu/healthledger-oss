'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  Shield,
  Users,
  FileText,
  Settings,
  CreditCard,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
  },
  {
    name: 'Expenses',
    href: ROUTES.expenses,
    icon: Receipt,
  },
  {
    name: 'Insurance Plans',
    href: ROUTES.insurance,
    icon: Shield,
  },
  {
    name: 'Family Members',
    href: ROUTES.family,
    icon: Users,
  },
  {
    name: 'Reports',
    href: ROUTES.reports,
    icon: FileText,
  },
];

const bottomNavigation = [
  {
    name: 'Settings',
    href: ROUTES.settings,
    icon: Settings,
  },
  {
    name: 'Billing',
    href: ROUTES.billing,
    icon: CreditCard,
  },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === ROUTES.dashboard) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-4">
          <Link href={ROUTES.dashboard} className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-600">
              <span className="text-lg font-bold text-white">H</span>
            </div>
            {!isCollapsed && (
              <span className="text-xl font-semibold text-gray-900">
                HealthLedger
              </span>
            )}
          </Link>
        </div>

        {/* Quick action */}
        <div className="border-b p-4">
          <Link href={ROUTES.newExpense}>
            <Button
              className={cn(
                'w-full bg-teal-600 hover:bg-teal-700',
                isCollapsed && 'px-2'
              )}
            >
              <Plus className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Add Expense</span>}
            </Button>
          </Link>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  isCollapsed && 'justify-center px-2'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom navigation */}
        <div className="border-t p-4 space-y-1">
          {bottomNavigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  isCollapsed && 'justify-center px-2'
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Collapse toggle */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={onToggle}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
