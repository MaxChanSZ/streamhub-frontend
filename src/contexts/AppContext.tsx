import React, { useContext, useEffect, useState } from "react";
import { Toaster } from "@/components/shadcn/ui/toaster";
import { User } from "@/utils/types";

type AppContext = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

/**
 * AppContextProvider is a React Context Provider component that provides
 * the application context to its child components.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @return {JSX.Element} The AppContext.Provider component with the
 *                       application context value and the Toaster component.
 */
export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  // State variables to manage the login status and user information.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  /**
   * Renders the AppContext.Provider component with the application context value
   * and the Toaster component as its children.
   *
   * @return {JSX.Element} The AppContext.Provider component.
   */
  return (
    <AppContext.Provider
      value={{
        isLoggedIn, // The current login status.
        setIsLoggedIn, // The function to update the login status.
        user, // The current user information.
        setUser, // The function to update the user information.
      }}
    >
      {children} {/* The child components. */}
      <Toaster /> {/* The Toaster component to display toast notifications. */}
    </AppContext.Provider>
  );
};

/**
 * Custom hook that provides access to the application context.
 *
 * @return {AppContext} The application context object.
 * @throws {Error} If the hook is not used within an AppContextProvider.
 */
export const useAppContext = (): AppContext => {
  // Get the application context from the React Context API.
  const context = useContext(AppContext);

  // If the context is undefined, it means the hook is not used within an
  // AppContextProvider. Throw an error to indicate this.
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }

  // Return the application context.
  return context as AppContext;
};
