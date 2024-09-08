import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface SidebarContextType {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [active, setActive] = useState(false);

  return (
    <SidebarContext.Provider value={{ active, setActive }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebarContext must be used within a SidebarContextProvider"
    );
  }
  return context;
};
