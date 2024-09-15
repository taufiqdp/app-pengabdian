import localFont from "next/font/local";
import "../globals.css";
import MainSidebar from "@/components/main-sidebar";
import Footer from "@/components/footer";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata = {
  title: "Desa Semanu",
  description: "Desa Semanu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geistSans.className}>
      <body>
        <MainSidebar>{children}</MainSidebar>
        <Footer />
      </body>
    </html>
  );
}
