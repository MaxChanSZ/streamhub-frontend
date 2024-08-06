import { Button } from "@/components/shadcn/ui/button";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "@/api-client";
import { redirect, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
export type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const { showToast } = useAppContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  // const navigate = useNavigate();
  const inputFieldFormat =
    "border rounded w-full py-2 px-3.5 my-2 font-normal text-black text-lg";
  const errorTextFormat = "text-red-500";

  // Send form submit data to API client for registration
  const mutation = useMutation(apiClient.register, {
    onSuccess: () => {
      showToast({
        message: "Registration success",
        type: "SUCCESS",
      });
      // navigate("/");
      console.log("Registration success");
    },
    onError: (error: Error) => {
      showToast({
        message: error.message,
        type: "ERROR",
      });
    },
  });
  const onFormSubmit = handleSubmit((data) => {
    console.log(data);
    mutation.mutate(data);
  });

  return (
    <div className="flex-col justify-center">
      <h1 className="text-3xl text-white px-4 font-bold text-center">
        Create an account
      </h1>
      ;
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
              <span className={errorTextFormat}>{errors.username.message}</span>
            )}
          </label>
          <label className="flex-1">
            Email Address
            <input
              className={inputFieldFormat}
              {...register("email", { required: "This field is required" })}
              type="email"
            ></input>
            {errors.email && (
              <span className={errorTextFormat}>{errors.email.message}</span>
            )}
          </label>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
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
              <span className={errorTextFormat}>{errors.password.message}</span>
            )}
          </label>
          <label className="flex-1">
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
            ></input>
            {errors.confirmPassword && (
              <span className={errorTextFormat}>
                {errors.confirmPassword.message}
              </span>
            )}
          </label>
        </div>
        <div className="text-center">
          <Button type="submit" variant="secondary" className="my-4">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
