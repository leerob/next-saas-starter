'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CircleIcon, Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/lib/auth';
import { signOut } from '@/app/(login)/actions';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useUser();

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <CircleIcon className="h-6 w-6 text-orange-500" />
          <span className="ml-2 text-xl font-semibold text-gray-900">ACME</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Pricing
          </Link>
          {user ? (
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={`https://unavatar.io/${user.username}`}
                    alt={user.username}
                  />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <form action={signOut}>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <button type="submit">Sign out</button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-full"
            >
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Header />
      {children}
    </section>
  );
}
