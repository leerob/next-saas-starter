"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/auth";
import { Loader2, ShoppingCart, ClipboardList } from "lucide-react";
import { Suspense } from "react";
import { UserState } from "./user-state";

export function Nav() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/home" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Online Shop
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {user && (
              <Link href="/orders">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ClipboardList className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="mr-2">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Suspense fallback={<UserLoadingState />}>
              <UserState user={user} />
            </Suspense>
          </nav>
        </div>
      </div>
    </header>
  );
}

function UserLoadingState() {
  return (
    <Button variant="ghost" size="sm" disabled>
      <Loader2 className="h-4 w-4 animate-spin" />
    </Button>
  );
}
