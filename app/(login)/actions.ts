"use server";

import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { comparePasswords, hashPassword } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createCheckoutSession } from "@/lib/payments/stripe";
import { getUser } from "@/lib/db/queries";
import {
  validatedAction,
  validatedActionWithUser,
} from "@/lib/auth/middleware";

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

export const signIn = validatedAction(signInSchema, async (data, formData) => {
  const { email, password } = data;

  const foundUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .then((rows) => rows[0]);

  if (!foundUser) {
    return { error: "メールアドレスまたはパスワードが正しくありません。" };
  }

  const isValidPassword = await comparePasswords(
    password,
    foundUser.passwordHash
  );
  if (!isValidPassword) {
    return { error: "メールアドレスまたはパスワードが正しくありません。" };
  }

  const session = {
    user: {
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  const priceId = formData.get("priceId") as string;
  if (priceId) {
    return createCheckoutSession({ user: foundUser, priceId });
  }

  redirect("/");
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
  const { email, password, name } = data;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .then((rows) => rows[0]);

  if (existingUser) {
    return {
      error: "このメールアドレスは既に登録されています。",
      email,
      password,
      name,
    };
  }

  const passwordHash = await hashPassword(password);

  const [createdUser] = await db
    .insert(users)
    .values({
      email,
      name,
      passwordHash,
      role: "member",
    })
    .returning();

  const session = {
    user: {
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  const priceId = formData.get("priceId") as string;
  if (priceId) {
    return createCheckoutSession({ user: createdUser, priceId });
  }

  redirect("/");
});

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8).max(100),
    newPassword: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {
    const { currentPassword, newPassword } = data;

    const isValidPassword = await comparePasswords(
      currentPassword,
      user.passwordHash
    );
    if (!isValidPassword) {
      return { error: "現在のパスワードが正しくありません。" };
    }

    if (currentPassword === newPassword) {
      return {
        error: "新しいパスワードは現在のパスワードと異なる必要があります。",
      };
    }

    const passwordHash = await hashPassword(newPassword);

    await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return { success: "パスワードを更新しました。" };
  }
);

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100),
});

export const deleteAccount = validatedActionWithUser(
  deleteAccountSchema,
  async (data, _, user) => {
    const { password } = data;

    const isValidPassword = await comparePasswords(password, user.passwordHash);
    if (!isValidPassword) {
      return { error: "パスワードが正しくありません。" };
    }

    await db
      .update(users)
      .set({
        deletedAt: sql`CURRENT_TIMESTAMP`,
        email: sql`CONCAT(email, '-', id, '-deleted')`, // メールアドレスの一意性を保持
      })
      .where(eq(users.id, user.id));

    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/login");
  }
);

const updateAccountSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(100),
  email: z.string().email("メールアドレスの形式が正しくありません"),
});

export const updateAccount = validatedActionWithUser(
  updateAccountSchema,
  async (data, _, user) => {
    const { name, email } = data;

    await db
      .update(users)
      .set({
        name,
        email,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return { success: "アカウント情報を更新しました。" };
  }
);
