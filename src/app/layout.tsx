import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: {
    default: 'MillworkDatabase — Share & Discover Architectural Millwork Designs',
    template: '%s | MillworkDatabase',
  },
  description:
    'Share, discover, and download millwork designs for CNC cutting. Door casings, crown molding, stair parts, mantels, and more. Free community for DIYers and professionals.',
  keywords: [
    'millwork',
    'molding',
    'trim',
    'CNC',
    'woodworking',
    'crown molding',
    'baseboard',
    'door casing',
    'stair parts',
    'newel post',
    'mantel',
    'wainscoting',
    'architectural preservation',
    '3D model',
    'STL',
    'STEP',
  ],
  openGraph: {
    title: 'MillworkDatabase — Share & Discover Architectural Millwork Designs',
    description:
      'The community for sharing and downloading millwork profiles, stair parts, mantels, and built-ins for CNC cutting.',
    url: 'https://millworkdatabase.com',
    siteName: 'MillworkDatabase',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MillworkDatabase',
    description: 'Share & discover architectural millwork designs for CNC cutting.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
