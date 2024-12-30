import AssessmentQuestionsContextProvider from "@/contexts/AssessmentQuestionsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import CourseContextProvider from "@/contexts/CourseContext";
import { SidebarContextProvider } from "@/contexts/SidebarContext";
import { UserProvider } from "@/contexts/UserContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${roboto.variable} bg-[#FAFAFA]`}>
      <AuthProvider>
        <UserProvider>
          <AssessmentQuestionsContextProvider>
            <CourseContextProvider>
              <SidebarContextProvider>
                <Component {...pageProps} />
              </SidebarContextProvider>
            </CourseContextProvider>
          </AssessmentQuestionsContextProvider>
        </UserProvider>
      </AuthProvider>

      <Toaster />
    </main>
  );
}
