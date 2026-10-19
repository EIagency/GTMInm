import type { Metadata } from 'next';
import { Manrope, DM_Sans } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GTM in Motion | Intelligent Go-to-Market Engineering',
  description:
    'GTM in Motion builds AI-powered go-to-market systems for complex B2B organisations. Connect market signals, sales execution and revenue operations into one intelligent growth engine.',
  metadataBase: new URL('https://gtminmotion.com'),
  openGraph: {
    title: 'GTM in Motion | Intelligent Go-to-Market Engineering',
    description:
      'Turn go-to-market into a connected growth system. AI-powered GTM engineering for ambitious B2B organisations.',
    url: 'https://gtminmotion.com/',
    siteName: 'GTM in Motion',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${manrope.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="bg-cream text-ink font-body antialiased selection:bg-lime selection:text-ink">
        {children}
      </body>
    </html>
  );
}

