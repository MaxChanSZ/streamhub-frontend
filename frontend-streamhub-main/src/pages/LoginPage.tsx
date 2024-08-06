import { Button } from "@/components/shadcn/ui/button";
import { toast } from "@/components/shadcn/ui/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { useForm } from "react-hook-form";

export type LoginFormData = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const { setLogin, setUser } = useAppContext();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onFormSubmit = handleSubmit((data) => {
    console.log(data);
  });

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
      title: "Logged in successfully!",
    });
  };
  const inputFieldFormat =
    "border rounded w-full py-2 px-3.5 my-2 font-normal text-black text-lg";
  const errorTextFormat = "text-red-500";

  return (
    <div className="text-white font-alatsi text-semibold flex flex-col justify-center">
      <h2 className="text-2xl text-center">Login Page</h2>
      <div className="justify-center">
        <form
          className="text-white align-center font-bold px-4 py-4"
          onSubmit={onFormSubmit}
        >
          <div className="flex flex-col md:flex-row gap-5">
            <label className="flex-1">
              Username
              <input
                className={inputFieldFormat}
                {...register("username", {
                  required: "This field is required",
                })}
              ></input>
              {errors.username && (
                <span className={errorTextFormat}>
                  {errors.username.message}
                </span>
              )}
            </label>

            <label className="flex-1">
              Password
              <input
                className={inputFieldFormat}
                {...register("password", {
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                type="password"
              ></input>
              {errors.password && (
                <span className={errorTextFormat}>
                  {errors.password.message}
                </span>
              )}
            </label>
          </div>
          <div className="text-center">
            {/* <Button
              type="submit"
              variant="secondary"
              className="my-4 font-alatsi text-base"
            >
              Submit
            </Button> */}
          </div>
        </form>
      </div>
      <Button
        onClick={() => handleLogin()}
        variant="secondary"
        className="text-base mx-2 px-4 py-1 w-1/4 self-center"
      >
        Login
      </Button>
    </div>
  );
};

export default LoginPage;
