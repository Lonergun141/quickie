import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const incompleeta = localFont({
  src: "../../public/fonts/Incompleeta/IncompleetaRegular.ttf",
  variable: "--font-incompleeta",
});

export const metadata: Metadata = {
  title: "Quickie",
  description: "AI-Powered Study Assistant",
};

import { ThemeProvider } from "@/components/theme-provider";
import { ColorThemeProvider } from "@/context/ColorThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} ${incompleeta.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <ColorThemeProvider>
            {children}
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
