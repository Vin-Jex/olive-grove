import { checkLoginStatus } from "@/components/utils/authUtils";
import { useRouter } from "next/router";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type TRole = "Teacher" | "Student" | "Admin";
interface IUser {
  id: string;
  role: TRole;
}

interface AuthState {
  loggedIn: boolean;
  user: IUser | null;
  role: "student" | "teacher" | "admin" | undefined;
}

const AuthContext = createContext<
  (AuthState & { reCheckUser: () => void }) | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    loggedIn: false,
    user: null,
    role: undefined,
  });
  const [loading, setLoading] = useState<boolean>(true);

  const reCheckUser = () => {
    const status = checkLoginStatus();
    setAuth({
      loggedIn: status.loggedIn,
      user: status.loggedIn ? status.user! : null,
      role: status.loggedIn
        ? (status.user!.role as any)?.toLocaleLowerCase()
        : undefined,
    });
    setLoading(false);
  };

  useEffect(() => {
    reCheckUser();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ ...auth, reCheckUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
