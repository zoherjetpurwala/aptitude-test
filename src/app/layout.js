import { Inter } from "next/font/google";
import "./globals.css";
import LogoutModal from "@/components/Modals/LogoutModal";
import { Suspense } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aptitute Test",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            {children}
            <Suspense>
              <LogoutModal />
            </Suspense>
          </NextThemesProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
