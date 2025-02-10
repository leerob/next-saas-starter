import { Metadata } from "next";
import { ProfileForm } from "@/components/settings/profile-form";
import { mockUser } from "@/lib/mock/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "設定",
  description: "ユーザー設定を管理します。",
};

export default async function SettingsPage() {
  // モックユーザーデータを使用
  const user = mockUser;

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">設定</h1>
          <p className="text-muted-foreground">
            アカウント設定とユーザープロフィールを管理します。
          </p>
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>プロフィール</CardTitle>
            <CardDescription>
              あなたのプロフィール情報を表示・管理します。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
