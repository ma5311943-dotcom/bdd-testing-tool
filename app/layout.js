import { ClerkProvider } from "@clerk/nextjs";
import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";

export const metadata = {
  title: "Bdd Testify Scenarios - AI-Driven Web Testing",
  description: "The standard in AI-driven web analysis. Providing deep insights into performance, security, and behavioral compliance.",
  icons: {
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYU687axhSzw0lS_olFU3Rrr5VaQsXIgiSLg&s",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning>
          <ClientLayout>
            {children}
          </ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}

