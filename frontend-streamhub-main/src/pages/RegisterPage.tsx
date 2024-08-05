import { Button } from "@/components/shadcn/ui/button";
import { useForm } from "react-hook-form";
type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const { register, watch, handleSubmit } = useForm<RegisterFormData>();
  const inputFieldFormat =
    "border rounded w-full py-2 px-3.5 my-2 font-normal text-black text-lg";
  return (
    <>
      <h1 className="text-3xl text-white px-4 font-bold">Create an account</h1>;
      <form className="text-white align-center font-bold px-4 py-4">
        <div className="flex flex-col md:flex-row gap-5">
          <label className="flex-1">
            Username
            <input
              className={inputFieldFormat}
              {...register("username")}
            ></input>
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
          <Button type="submit" variant="secondary" className="my-4">
            Submit
          </Button>
        </span>
      </form>
    </>
  );
};

export default RegisterPage;
