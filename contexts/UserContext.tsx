import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getUserFromDB } from "@/components/utils/indexDB";
import { TUser } from "@/components/utils/types";

interface UserContextType {
  user: TUser | null;
  setUser: React.Dispatch<React.SetStateAction<TUser | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<TUser | null>(null);

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const userDetails = await getUserFromDB(userId, userId);
        setUser(userDetails);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
