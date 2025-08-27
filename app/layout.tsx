import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PWAPrompt } from '@/components/layout/PWAPrompt';
import { ToastProvider } from '@/components/ui/toast';
import { ClientAuthProvider } from '@/components/providers/ClientAuthProvider';
import { PWA_CONFIG } from '@/lib/constants';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: PWA_CONFIG.APP_NAME,
  description: PWA_CONFIG.DESCRIPTION,
  keywords: [
    'prompt enhancement',
    'AI prompts',
    'prompt engineering',
    'OpenAI',
    'GPT',
    'artificial intelligence',
    'prompt optimization'
  ],
  authors: [{ name: 'Prompt Enhancer Team' }],
  creator: 'Prompt Enhancer',
  publisher: 'Prompt Enhancer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://prompt-enhancer.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://prompt-enhancer.vercel.app',
    title: PWA_CONFIG.APP_NAME,
    description: PWA_CONFIG.DESCRIPTION,
    siteName: PWA_CONFIG.APP_NAME,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: PWA_CONFIG.APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PWA_CONFIG.APP_NAME,
    description: PWA_CONFIG.DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@promptenhancer',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: PWA_CONFIG.SHORT_NAME,
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export const viewport = {
  themeColor: PWA_CONFIG.THEME_COLOR,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} font-body bg-background text-text-primary antialiased`}>
        <ToastProvider>
          <ClientAuthProvider>
            {/* Animated Background */}
            <AnimatedBackground />

            {/* Main Content */}
            <div className="relative min-h-screen flex flex-col">
              <Header />

              <main className="flex-1">
                {children}
              </main>

              <Footer />
            </div>

            {/* PWA Components */}
            <PWAPrompt />
          </ClientAuthProvider>
        </ToastProvider>
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
