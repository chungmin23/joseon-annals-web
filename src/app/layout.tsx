import Providers from "@/components/providers";
import type { Metadata } from 'next';
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-kr',
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-noto-serif-kr',
});

export const metadata: Metadata = {
  title: '조선실록톡 (Joseon Annals Talk)',
  description: '조선시대 왕들과 대화하며 역사를 배우는 AI 챗봇 서비스',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={cn(
          'min-h-screen bg-[var(--bg-primary)] font-sans antialiased text-[var(--text-primary)]',
          notoSansKr.variable,
          notoSerifKr.variable
        )}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
