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

  /**
   * Mutation hook for registering a user.
   * On success, shows a success toast and redirects to the login page.
   * On error, shows an error toast with the error message.
   */
  const mutation = useMutation(apiClient.register, {
    // Callback function to handle successful registration
    onSuccess: () => {
      // Show success toast
      toast({
        title: "Registration success, please login",
      });
      // Log success message to console
      console.log("Registration success");
      // Redirect to login page
      window.location.pathname = "/";
    },
    // Callback function to handle registration error
    onError: (error: Error) => {
      // Show error toast with error message
      toast({
        title: "Error",
        description: `${error.message}`,
        variant: "destructive",
      });
      // Log error to console for debugging
      console.log(error);
    },
  });

  // Send form submit data to API client for registration
  /**
   * Handles form submission by calling the mutation with the form data.
   * @param {RegisterFormData} data - Form data containing username, email, password, and confirm password.
   */
  const onFormSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className={mainDivFormat}>
      {/* Page heading */}
      <h1 className="text-2xl text-white px-4 text-center">
        Create an account
      </h1>
      {/* Registration form */}
      <form
        className="text-white align-center font-medium px-4 py-4 container"
        onSubmit={onFormSubmit}
      >
        {/* Username and email fields */}
        <div className={subDivFormat}>
          {/* Username field */}
          <label className={labelFormat}>
            Username
            <input
              className={inputFieldFormat}
              {...register("username", {
                required: "This field is required",
              })}
            />
            {/* Error message for username field */}
            {errors.username && (
              <span className={errorTextFormat}>{errors.username.message}</span>
            )}
          </label>
          {/* Email field */}
          <label className={labelFormat}>
            Email Address
            <input
              className={inputFieldFormat}
              {...register("email", { required: "This field is required" })}
              type="email"
            />
            {/* Error message for email field */}
            {errors.email && (
              <span className={errorTextFormat}>{errors.email.message}</span>
            )}
          </label>
        </div>
        {/* Password and confirm password fields */}
        <div className={subDivFormat}>
          {/* Password field */}
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
            {/* Error message for password field */}
            {errors.password && (
              <span className={errorTextFormat}>{errors.password.message}</span>
            )}
          </label>
          {/* Confirm Password field */}
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
            {/* Error message for confirm password field */}
            {errors.confirmPassword && (
              <span className={errorTextFormat}>
                {errors.confirmPassword.message}
              </span>
            )}
          </label>
        </div>
        {/* Submit button */}
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
