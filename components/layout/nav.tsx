"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/auth";
import { signOut } from "@/app/(login)/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, User } from "lucide-react";
import { Suspense } from "react";

export function Nav() {
  const pathname = usePathname();
  const { userPromise } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Online Shop
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <Suspense fallback={<UserLoadingState />}>
              <UserState userPromise={userPromise} />
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

async function UserState({ userPromise }: { userPromise: Promise<any> }) {
  const user = await userPromise;

  if (!user) {
    return (
      <>
        <Link href="/sign-in">
          <Button variant="ghost" size="sm">
            サインイン
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button variant="default" size="sm">
            新規登録
          </Button>
        </Link>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span>{user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/settings">設定</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={() => signOut()}
        >
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
