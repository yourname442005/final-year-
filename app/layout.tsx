import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI-Native Research Intelligence Platform',
  description: 'A unified environment for discovering, understanding, organizing, collaborating around, and publishing research.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#f0eee6] text-[#141413] min-h-screen font-serif">
        {children}
      </body>
    </html>
  );
}

