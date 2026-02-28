import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/ui";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/hooks/useAuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "ASCESA - Associação dos Servidores do Sicoob",
    template: "%s | ASCESA",
  },
  description: "Credificando benefícios e vantagens para você e sua família.",
  keywords: ["ASCESA", "associação", "servidores", "Sicoob", "benefícios", "convênios", "descontos"],
  authors: [{ name: "ASCESA" }],
  creator: "ASCESA",
  publisher: "ASCESA",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://ascesa.com.br",
    siteName: "ASCESA",
    title: "ASCESA - Associação dos Servidores do Sicoob",
    description: "Credificando benefícios e vantagens para você e sua família.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ASCESA - Associação dos Servidores do Sicoob",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ASCESA - Associação dos Servidores do Sicoob",
    description: "Credificando benefícios e vantagens para você e sua família.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://ascesa.com.br",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ToastProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
