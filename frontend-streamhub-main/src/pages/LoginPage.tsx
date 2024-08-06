import { Button } from "@/components/shadcn/ui/button";
import { toast } from "@/components/shadcn/ui/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "@/api-client";
import { User } from "@/types";

export type LoginFormData = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const { setIsLoggedIn, setUser } = useAppContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const mutation = useMutation<User, Error, LoginFormData>(apiClient.login, {
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      setUser({
        id: data.id,
        username: data.username,
      });
      setIsLoggedIn(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
      });
      console.log(error);
    },
  });

  const onFormSubmit = handleSubmit((data) => {
    console.log(data);
    mutation.mutate(data);
  });

  // const handleLogin = () => {
  //   // Simulate login process
  //   const userData = {
  //     id: 12345,
  //     username: "may_lwin",
  //     email: "john_doe@example.com",
  //   };
  //   // TODO: add request to backend

  //   setUser(userData);
  //   setIsLoggedIn(true);
  //   toast({
  //     title: "Logged in successfully!",
  //   });
  // };
  const inputFieldFormat =
    "border rounded w-full py-2 px-3.5 my-2 font-normal text-black text-lg";
  const errorTextFormat = "text-red-500";

  return (
    <div className="text-white font-alatsi text-semibold flex flex-col justify-center">
      {/* <h2 className="text-2xl text-center">Login Page</h2> */}
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
              />
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
                  required: "This field is required",
                })}
                type="password"
              />
              {errors.password && (
                <span className={errorTextFormat}>
                  {errors.password.message}
                </span>
              )}
            </label>
          </div>
          <div className="text-center">
            <Button
              type="submit"
              variant="secondary"
              className="my-4 font-alatsi text-base"
            >
              Login
            </Button>
            {/* <Button
              onClick={handleLogin}
              variant="secondary"
              className="my-4 font-alatsi text-base"
            >
              Login
            </Button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
