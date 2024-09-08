import { SidebarContextProvider } from "@/contexts/SidebarContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${roboto.variable}`}>
      <SidebarContextProvider>
        <Component {...pageProps} />
      </SidebarContextProvider>
    </main>
  );
}
