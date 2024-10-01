import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';
import { LOCAL_STORAGE_KEY } from '@/components/dark-mode-toggle'

export const metadata: Metadata = {
  title: 'Next.js SaaS Starter',
  description: 'Get started quickly with Next.js, Postgres, and Stripe.',
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userPromise = getUser();

  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className}`}
    >
      <head>
        <script
            dangerouslySetInnerHTML={{
              __html: `
                if (localStorage.getItem(${LOCAL_STORAGE_KEY}) === 'dark' || (!(${LOCAL_STORAGE_KEY} in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.setProperty('color-scheme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.removeProperty('color-scheme');
                }
              `,
            }}
        />
      </head>
      <body className="min-h-[100dvh] bg-gray-50">
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  );
}
