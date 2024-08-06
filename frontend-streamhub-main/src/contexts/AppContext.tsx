import React, { useContext, useEffect, useState } from "react";
import { Toaster } from "@/components/shadcn/ui/toaster";

type User = {
  id: number;
  username: string;
  email: string;
};

type AppContext = {
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  return (
    <AppContext.Provider
      value={{
        login,
        setLogin,
        user,
        setUser,
      }}
    >
      {children}
      <Toaster />
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context as AppContext;
};
