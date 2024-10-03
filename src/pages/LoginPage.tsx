import { Button } from "@/components/shadcn/ui/button";
import { toast } from "@/components/shadcn/ui/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "@/utils/api-client";
import { User } from "@/utils/types";
import WordleLoginButton from "@/components/WordleLoginButton";

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
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      });
      console.log(error);
    },
  });

  const onFormSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const mainDivFormat = "text-white font-alatsi justify-center w-full";
  const inputFieldFormat =
    "border rounded py-2 px-3.5 my-2 font-sans font-medium text-black text-lg";
  const errorTextFormat = "text-red-500";
  const labelFormat = "flex flex-col";
  const subDivFormat = "grid grid-cols-2 gap-5";

  return (
    <div className={mainDivFormat}>
      <h1 className="text-2xl text-white px-4 text-center">Welcome Back!</h1>

      <form
        className="text-white align-center font-medium px-4 py-4"
        onSubmit={onFormSubmit}
      >
        <div className={subDivFormat}>
          <label className={labelFormat}>
            Username
            <input
              className={inputFieldFormat}
              {...register("username", {
                required: "This field is required",
              })}
            />
            {errors.username && (
              <span className={errorTextFormat}>{errors.username.message}</span>
            )}
          </label>

          <label className={labelFormat}>
            Password
            <input
              className={inputFieldFormat}
              {...register("password", {
                required: "This field is required",
              })}
              type="password"
            />
            {errors.password && (
              <span className={errorTextFormat}>{errors.password.message}</span>
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
        </div>
      </form>

      <div className="text-center">
        <WordleLoginButton />
      </div>
    </div>
  );
};

export default LoginPage;
