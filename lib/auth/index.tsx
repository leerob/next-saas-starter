'use client';

import { createContext, useContext, ReactNode } from 'react';
import { use } from 'react';
import { User } from '@/lib/db/schema';

const UserContext = createContext<User | null>(null);

export function useUser() {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return user;
}

export function UserProvider({
  children,
  userPromise,
}: {
  children: ReactNode;
  userPromise: Promise<User | null>;
}) {
  const user = use(userPromise);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
