import { Toast } from "@/components/Toast";
import React, { useContext, useEffect, useState } from "react";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type User = {
  id: number;
  username: string;
  email: string;
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
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
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage: ToastMessage) => {
          console.log(toastMessage);
        },
        login,
        setLogin,
        user,
        setUser,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
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
