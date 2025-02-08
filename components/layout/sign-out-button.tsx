"use client";

import { signOut } from "@/app/(login)/actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SignOutButton() {
  return (
    <DropdownMenuItem className="text-destructive" onClick={() => signOut()}>
      ログアウト
    </DropdownMenuItem>
  );
}
