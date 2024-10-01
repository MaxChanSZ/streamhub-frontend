import { useAppContext } from "@/contexts/AppContext";
import { toast } from "./shadcn/ui/use-toast";
import { Button } from "./shadcn/ui/button";

const LogoutButton = () => {
  const { setIsLoggedIn, setUser } = useAppContext();
  const handleLogout = () => {
    try {
      // Set user state to null
      setUser(null);
      // Set isLoggedIn state to false
      setIsLoggedIn(false);
      // Display a toast notification with the title "Logged out"
      toast({
        title: "Logged out",
      });
    } catch (error) {
      // Log the error that occurred during the logout process
      console.error(`Error during logout: ${error}`);
      // Additional error handling logic can be added here
    }
  };

  return (
    <Button
      variant="destructive"
      className="text-2xl mx-4"
      onClick={handleLogout}
      aria-label="Logout"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
