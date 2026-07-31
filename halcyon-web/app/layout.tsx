import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Halcyon — AI Incident Intelligence SaaS Platform',
  description: 'Instantly resolve system alerts by tapping into an active, self-learning institutional memory of past fixes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-black text-white antialiased min-h-screen">
        {children}
        <Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: '#080C1E', borderColor: 'rgba(52,245,230,0.3)', color: '#fff' } }} />
      </body>
    </html>
  );
}
