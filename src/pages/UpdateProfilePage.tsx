import { set, useForm } from "react-hook-form";
import { Button } from "@/components/shadcn/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { toast } from "@/components/shadcn/ui/use-toast";
import * as apiClient from "@/utils/api-client";
import { useAppContext } from "@/contexts/AppContext";

export type UpdateFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const UpdateProfilePage = () => {
  const inputFieldFormat =
    "border rounded w-full py-2 px-3.5 my-2 text-black text-lg";
  const errorTextFormat = "text-red-500";
  /**
   * Reactive form hook for updating user profile.
   */
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormData>();

  /**
   * Context hook for app context.
   */
  const { setIsLoggedIn, setUser } = useAppContext();

  /**
   * Navigation hook for routing.
   */
  const navigate = useNavigate();

  /**
   * Mutation hook for updating user profile.
   */
  const mutation = useMutation(apiClient.update, {
    /**
     * Callback function for handling successful update.
     */
    onSuccess: () => {
      // Display success toast
      toast({
        title: "Update success",
        description: "Redirecting to landing page, please login",
      });
      console.log("Update success");
      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
    },
    /**
     * Callback function for handling error.
     * @param {Error} error - The error object.
     */
    onError: (error: Error) => {},
  });

  /**
   * Handles form submission by sending data to API client for update.
   */
  // Send form submit data to API client for registration
  const onFormSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });
  const deleteButtonPress = () => {
    const { setIsLoggedIn, user } = useAppContext();
    if (user !== null) {
      apiClient.deleteUser(user?.id);
      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
    }
  };

  return (
    // Form for updating user profile
    <>
      <form
        className="text-white align-center font-bold px-4 py-4"
        onSubmit={onFormSubmit}
      >
        {/* Heading */}
        <h2 className="text-3xl my-4">Update particulars</h2>
        {/* Input fields for username and email */}
        <div className="flex flex-col md:flex-row gap-5">
          <label className="flex-1">
            {/* Username */}
            Username
            <input
              className={inputFieldFormat}
              {...register("username")}
            ></input>
            {/* Error message for username */}
            {errors.username && (
              <span className={errorTextFormat}>{errors.username.message}</span>
            )}
          </label>
          <label className="flex-1">
            {/* Email address */}
            Email Address
            <input
              className={inputFieldFormat}
              {...register("email")}
              type="email"
            ></input>
            {/* Error message for email */}
            {errors.email && (
              <span className={errorTextFormat}>{errors.email.message}</span>
            )}
          </label>
        </div>
        {/* Input fields for password and confirm password */}
        <div className="flex flex-col md:flex-row gap-5">
          <label className="flex-1">
            {/* Password */}
            Password
            <input
              className={inputFieldFormat}
              {...register("password", {
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
            ></input>
            {/* Error message for password */}
            {errors.password && (
              <span className={errorTextFormat}>{errors.password.message}</span>
            )}
          </label>
          <label className="flex-1">
            {/* Confirm password */}
            Confirm Password
            <input
              className={inputFieldFormat}
              {...register("confirmPassword", {
                validate: (value) => {
                  // Validates if confirm password matches password
                  if (!value) {
                    return "Please enter a password";
                  } else if (watch("password") !== value) {
                    return "Your passwords do not match";
                  }
                },
              })}
              type="password"
            ></input>
            {/* Error message for confirm password */}
            {errors.confirmPassword && (
              <span className={errorTextFormat}>
                {errors.confirmPassword.message}
              </span>
            )}
          </label>
        </div>
        {/* Submit button */}
        <div className="text-center py-4">
          <Button type="submit" variant="secondary">
            Submit
          </Button>
        </div>
      </form>
      <div className="text-center">
        <Button variant="destructive">Delete Account</Button>
      </div>
    </>
  );
};

export default UpdateProfilePage;
