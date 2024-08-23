import { Inter } from "next/font/google";
import "./globals.css";
import LogoutModal from "@/components/Modals/LogoutModal";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aptitute Test",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Suspense>
          <LogoutModal />
        </Suspense>
      </body>
    </html>
  );
}
