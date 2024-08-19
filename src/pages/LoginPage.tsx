import { Button } from "@/components/shadcn/ui/button";
import { toast } from "@/components/shadcn/ui/use-toast";
import { useAppContext } from "@/contexts/AppContext";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "@/utils/api-client";
import { User } from "@/utils/types";
import ForceLoginButtonMay from "@/components/ForceLoginButtonMay";

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

  /**
   * React query mutation hook for login API endpoint.
   * On success, sets user in context and navigates to home page.
   * On error, displays an error message.
   */
  const mutation = useMutation<User, Error, LoginFormData>(apiClient.login, {
    // Callback function to handle successful login
    onSuccess: (data) => {
      // Display success toast
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      // Set user in context
      setUser({
        id: data.id,
        username: data.username,
      });
      // Set isLoggedIn flag in context to true
      setIsLoggedIn(true);
    },
    // Callback function to handle login error
    onError: (error: Error) => {
      // Display error toast with error message
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      });
      // Log error to console for debugging
      console.log(error);
    },
  });

  /**
   * Callback function to handle form submission.
   * Calls login mutation with form data.
   * @param {LoginFormData} data - Form data containing username and password.
   */
  const onFormSubmit = handleSubmit((data) => {
    // Call login mutation with form data
    mutation.mutate(data);
  });

  const mainDivFormat = "text-white font-alatsi justify-center w-full"; // format for main div
  const inputFieldFormat =
    "border rounded py-2 px-3.5 my-2 font-sans font-medium text-black text-lg"; // format for input field
  const errorTextFormat = "text-red-500";
  const labelFormat = "flex flex-col"; // each input field, title, and error message is wrapped by a label
  const subDivFormat = "grid grid-cols-2 gap-5"; // first two and last two fields are in each subdiv

  return (
    <div className={mainDivFormat}>
      {/* Heading for the login page */}
      <h1 className="text-2xl text-white px-4 text-center">Welcome Back!</h1>

      {/* Form for user login */}
      <form
        className="text-white align-center font-medium px-4 py-4"
        onSubmit={onFormSubmit}
      >
        {/* Username input field */}
        <div className={subDivFormat}>
          <label className={labelFormat}>
            {/* Label for the username input field */}
            Username
            {/* Input field for the username */}
            <input
              className={inputFieldFormat}
              {...register("username", {
                required: "This field is required",
              })}
            />
            {/* Display error message if username is required */}
            {errors.username && (
              <span className={errorTextFormat}>{errors.username.message}</span>
            )}
          </label>

          {/* Password input field */}
          <label className={labelFormat}>
            {/* Label for the password input field */}
            Password
            {/* Input field for the password */}
            <input
              className={inputFieldFormat}
              {...register("password", {
                required: "This field is required",
              })}
              type="password"
            />
            {/* Display error message if password is required */}
            {errors.password && (
              <span className={errorTextFormat}>{errors.password.message}</span>
            )}
          </label>
        </div>

        {/* Submit button for login */}
        <div className="text-center">
          <Button
            type="submit"
            variant="secondary"
            className="my-4 font-alatsi text-base"
          >
            {/* Text for the login button */}
            Login
          </Button>
        </div>
      </form>
      <div className="text-center">
        <ForceLoginButtonMay />
      </div>
    </div>
  );
};

export default LoginPage;
