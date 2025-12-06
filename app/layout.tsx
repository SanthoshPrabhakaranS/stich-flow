import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { AuthProvider } from "@/contexts/auth-context";
import { App as AntApp } from "antd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boutique Management",
  description: "Order, Measurement & Production Management System",
  manifest: "/manifest.json",
  themeColor: "#1890ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AntdRegistry>
          <AuthProvider>
            <AntApp>
              <LayoutWrapper>{children}</LayoutWrapper>
            </AntApp>
          </AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
