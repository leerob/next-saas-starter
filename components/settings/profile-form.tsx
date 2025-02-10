import { User } from "@/lib/db/schema";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <div className="grid gap-1">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            メールアドレス
          </label>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            名前
          </label>
          <p className="text-sm text-muted-foreground">
            {user.name || "未設定"}
          </p>
        </div>
      </div>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            ロール
          </label>
          <p className="text-sm text-muted-foreground">{user.role}</p>
        </div>
      </div>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            アカウント作成日
          </label>
          <p className="text-sm text-muted-foreground">
            {user.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
