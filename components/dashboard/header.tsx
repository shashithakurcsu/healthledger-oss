'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, Bell, LogOut, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { logout } from '@/features/auth';
import { ROUTES, SUBSCRIPTION_TIERS } from '@/constants';
import type { Profile } from '@/types';

interface HeaderProps {
  profile: Profile | null;
  onMenuClick: () => void;
}

export function Header({ profile, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };

  const tierInfo = profile
    ? SUBSCRIPTION_TIERS[profile.subscription_tier]
    : SUBSCRIPTION_TIERS.free;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Page title area - can be dynamic */}
      <div className="hidden lg:block">
        {/* Placeholder for breadcrumbs or page title */}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Subscription badge */}
        {profile && (
          <Badge
            variant={profile.subscription_tier === 'free' ? 'secondary' : 'default'}
            className={
              profile.subscription_tier !== 'free'
                ? 'bg-teal-600 hover:bg-teal-700'
                : ''
            }
          >
            {tierInfo.name} Plan
          </Badge>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          {/* Notification indicator */}
          {/* <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" /> */}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-teal-100 text-teal-700">
                  {profile
                    ? getInitials(profile.full_name, profile.email)
                    : '?'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(ROUTES.settings)}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(ROUTES.settings)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
