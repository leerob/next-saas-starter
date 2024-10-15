import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';
import { cookies } from 'next/headers'

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
  const storedTheme = cookies().get('next-sass-starter-theme')?.value
  let userPromise = getUser();

  return (
    <html
      lang="en"
      className={`${manrope.className}`}
    >
      <head>
        <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  if (${storedTheme === 'dark'} || (${!storedTheme} && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark')
                    document.documentElement.style.setProperty('color-scheme', 'dark')
                  }
                })();
              `,
            }}
        />
      </head>
      <body className="min-h-[100dvh] bg-gray-50 dark:bg-gray-900">
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  );
}
