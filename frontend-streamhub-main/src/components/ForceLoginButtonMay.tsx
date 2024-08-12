import { useAppContext } from "@/contexts/AppContext";
import { Button } from "./shadcn/ui/button";

const ForceLoginButtonMay = () => {
  const { setIsLoggedIn, setUser } = useAppContext();

  const handleForceLogin = () => {
    // Set user in context
    setUser({
      id: 9999,
      username: "maylwin.dev",
      email: "may.is.the.best@example.com",
    });
    // Set isLoggedIn flag in context to true
    setIsLoggedIn(true);
  };

  return (
    <>
      <Button variant="destructive" onClick={handleForceLogin}>
        FORCE LOGIN (for dev)
      </Button>
    </>
  );
};

export default ForceLoginButtonMay;
