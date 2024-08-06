import { Button } from "@/components/shadcn/ui/button";
import { toast } from "@/components/shadcn/ui/use-toast";
import { useAppContext } from "@/contexts/AppContext";

const LoginPage = () => {
  const { setLogin, setUser } = useAppContext();

  const handleLogin = () => {
    // Simulate login process
    const userData = {
      id: 12345,
      username: "may_lwin",
      email: "john_doe@example.com",
    };
    // TODO: add request to backend
    setUser(userData);
    setLogin(true);
    toast({
      title: "Successful login",
    });
  };

  return (
    <div className="text-white font-alatsi text-semibold flex flex-col justify-center">
      <h2 className="text-2xl my-5">Login Page</h2>
      <Button
        onClick={() => handleLogin()}
        variant="secondary"
        className="text-base mx-2 px-4 py-1 font-alatsi text-center"
      >
        Login
      </Button>
    </div>
  );
};

export default LoginPage;
