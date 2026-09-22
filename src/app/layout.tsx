import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'DEAR MEMORY — 디어메모리 본식스냅',
  description: '본식의 하루를 자연스럽고 깊이 있게 기록하는 본식스냅 전문 스튜디오 디어메모리입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-[#faf8f5] text-[#22201d]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
