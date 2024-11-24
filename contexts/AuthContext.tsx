import { checkLoginStatus } from "@/components/utils/authUtils";
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
}

const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ loggedIn: false, user: null });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const status = checkLoginStatus();
    setAuth({
      loggedIn: status.loggedIn,
      user: status.loggedIn ? status.user! : null,
    });
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
