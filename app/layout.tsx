import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast';

import Sidebar from "@/components/Sidebar";


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"]
});



export const metadata: Metadata = {
  title: "Socially",
  description: "Social app is the social media app you can see the world while you scrolling in your phone at home and explore the world, communication with your friends and follow the news",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn("h-full", "antialiased", montserrat.className,)}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col">

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />

            <main className="p-6">
              {/* container to make child responsive */}
              <div className="max-w-7xl mx-auto px-4">
                {/* grid system includes two col one from them will disapear in small devices which is sidebar and divide them 3 for sidebar 9 to children content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="col-span-3 hidden lg:block">
                    <Sidebar />
                  </div>
                  <div className="lg:col-span-9">{children}</div>
                </div>
              </div>
            </main>

            {/* toaster */}
            <Toaster />

          </ThemeProvider>

        </body>
      </html>
    </ClerkProvider>
  );
}
