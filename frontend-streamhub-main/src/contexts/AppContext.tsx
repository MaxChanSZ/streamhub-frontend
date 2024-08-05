import { Toast } from "@/components/Toast";
import React, { useContext, useEffect, useState } from "react";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const [login, setLogin] = useState(false);

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage: ToastMessage) => {
          console.log(toastMessage);
        },
        login,
        setLogin,
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
