import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeGe Sweets - Authentic Egyptian Delicacies",
  description: "Experience the rich traditions of Egyptian desserts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
