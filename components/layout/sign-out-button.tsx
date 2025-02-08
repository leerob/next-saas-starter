"use client";

import { signOut } from "@/app/(login)/actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("サインアウト中にエラーが発生しました:", error);
    }
  };

  return (
    <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
      ログアウト
    </DropdownMenuItem>
  );
}
