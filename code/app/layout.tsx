
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'Portal NewLoc - Locações',
  description: 'Portal de gestão e acompanhamento de locações - NewLoc Locações',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Portal NewLoc - Locações',
    description: 'Portal de gestão e acompanhamento de locações - NewLoc Locações',
    images: ['/og-image.png'],
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
