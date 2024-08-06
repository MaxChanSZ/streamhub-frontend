import { set, useForm } from "react-hook-form";
import { Button } from "@/components/shadcn/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { toast } from "@/components/shadcn/ui/use-toast";
import * as apiClient from "@/api-client";
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
  const { register, watch, handleSubmit } = useForm<UpdateFormData>();
  const { setIsLoggedIn, setUser } = useAppContext();
  const navigate = useNavigate();

  const mutation = useMutation(apiClient.update, {
    onSuccess: () => {
      toast({
        title: "Update success",
        description: "Redirecting to landing page, please login",
      });
      console.log("Update success");
      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
    },
    onError: (error: Error) => {},
  });

  // Send form submit data to API client for registration
  const onFormSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form
      className="text-white align-center font-bold px-4 py-4"
      onSubmit={onFormSubmit}
    >
      <h2 className="text-3xl my-4">Update particulars</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="flex-1">
          Username
          <input className={inputFieldFormat} {...register("userName")}></input>
          <input className={inputFieldFormat} {...register("username")}></input>
        </label>
        <label className="flex-1">
          Email Address
          <input
            className={inputFieldFormat}
            {...register("email")}
            type="email"
          ></input>
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
        </label>
      </div>
      <span>
        <Button type="submit" variant="secondary">
          Submit
        </Button>
      </span>
    </form>
  );
};

export default UpdateProfilePage;
