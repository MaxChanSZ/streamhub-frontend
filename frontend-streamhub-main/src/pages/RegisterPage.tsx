import { Button } from "@/components/shadcn/ui/button";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "@/utils/api-client";
import { toast } from "@/components/shadcn/ui/use-toast";
export type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  // Format strings
  const mainDivFormat = "text-white font-alatsi justify-center w-full"; // format for main div
  const inputFieldFormat =
    "border rounded py-2 px-3.5 my-2 font-sans font-medium text-black text-lg"; // format for input field
  const errorTextFormat = "text-red-500";
  const labelFormat = "flex flex-col"; // each input field, title, and error message is wrapped by a label
  const subDivFormat = "grid grid-cols-2 gap-5"; // first two and last two fields are in each subdiv

  const mutation = useMutation(apiClient.register, {
    onSuccess: () => {
      toast({
        title: "Registration success, please login",
      });
      console.log("Registration success");
      window.location.pathname = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `${error.message}`,
      });
      console.log(error);
    },
  });

  // Send form submit data to API client for registration
  const onFormSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className={mainDivFormat}>
      <h1 className="text-2xl text-white px-4 text-center">
        Create an account
      </h1>
      <form
        className="text-white align-center font-medium px-4 py-4 container"
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
            Email Address
            <input
              className={inputFieldFormat}
              {...register("email", { required: "This field is required" })}
              type="email"
            />
            {errors.email && (
              <span className={errorTextFormat}>{errors.email.message}</span>
            )}
          </label>
        </div>
        <div className={subDivFormat}>
          <label className={labelFormat}>
            Password
            <input
              className={inputFieldFormat}
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: {
                  hasUpperCase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Password must have at least one uppercase letter",
                  hasNumber: (value) =>
                    /\d/.test(value) ||
                    "Password must have at least one number",
                  hasSymbol: (value) =>
                    /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                    "Password must have at least one symbol",
                },
              })}
              type="password"
            />
            {errors.password && (
              <span className={errorTextFormat}>{errors.password.message}</span>
            )}
          </label>
          <label className={labelFormat}>
            Confirm Password
            <input
              className={inputFieldFormat}
              {...register("confirmPassword", {
                validate: (value) => {
                  if (!value) {
                    return "Please enter a password";
                  } else if (watch("password") !== value) {
                    return "Your passwords do not match";
                  }
                },
              })}
              type="password"
            />
            {errors.confirmPassword && (
              <span className={errorTextFormat}>
                {errors.confirmPassword.message}
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
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
