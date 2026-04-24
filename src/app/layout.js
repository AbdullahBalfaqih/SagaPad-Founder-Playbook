import "./globals.css";
import WalletContextProvider from "@/components/WalletContextProvider";

export const metadata = {
  title: "SagaPad Skill Marketplace — Win on X. From Day Zero.",
  description: "AI-powered playbooks that help Solana projects and founders build audience, credibility, and momentum on X from day zero.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
