import { AuthProvider } from "@/contexts/AuthContext";
import CourseContextProvider from "@/contexts/CourseContext";
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
    <main className={`${roboto.variable} bg-[#FAFAFA]`}>
      <AuthProvider>
        <CourseContextProvider>
          <SidebarContextProvider>
            <Component {...pageProps} />
          </SidebarContextProvider>
        </CourseContextProvider>
      </AuthProvider>
    </main>
  );
}
