import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import { UserProvider } from '@/lib/auth';
import { getUser } from '@/lib/db/queries';

import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: 'masakinihirota',
  description: `ネットという情報の洪水の中から真っ先に価値のある情報を拾い上げるWebサービス。
  適切な距離感のある友人を作る。
  ネット上の悪意をなくす。`,
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ['latin'] });

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  let userPromise = getUser();
  return (
    <html
      lang="ja"
      className={`${manrope.className}`}
    >

      <head />
      <body className="">
        <UserProvider userPromise={userPromise}>


          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>


        </UserProvider>
      </body>


    </html>
  );
}



// import { ModeToggle } from "@/components/mode-toggle";
// import { ThemeProvider } from "@/components/theme-provider"
// import { UserProvider } from '@/lib/auth';
// import { getUser } from '@/lib/db/queries';

// interface RootLayoutProps {
//   children: React.ReactNode
// }

// export default function RootLayout({ children }: RootLayoutProps) {
//   let userPromise = getUser();
//   return (
//     <>
//       <html lang="ja" suppressHydrationWarning>
//         <head />
//         <body className="">
//           <UserProvider userPromise={userPromise}>
//             <ThemeProvider
//               attribute="class"
//               defaultTheme="system"
//               enableSystem
//               disableTransitionOnChange
//             >
//               <ModeToggle />
//               {children}
//             </ThemeProvider>
//           </UserProvider>
//         </body>
//       </html>
//     </>
//   )
// }
