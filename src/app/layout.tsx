import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Murder Mystery Generator",
  description: "Create immersive murder mystery games with AI-powered generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64">
            <div className="min-h-screen">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
