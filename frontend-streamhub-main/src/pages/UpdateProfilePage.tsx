import { useForm } from "react-hook-form";

type UpdateFormData = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const UpdateProfilePage = () => {
  const inputFieldFormat =
    "border rounded w-full py-2 px-3.5 my-2 font-normal text-black text-lg";
  const { register, watch } = useForm<UpdateFormData>();

  return (
    <form className="text-white align-center font-bold px-4 py-4">
      <h2 className="text-3xl my-4">Update particulars</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="flex-1">
          Username
          <input className={inputFieldFormat} {...register("userName")}></input>
        </label>
        <label className="flex-1">
          Email Address
          <input className={inputFieldFormat} {...register("email")}></input>
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default UpdateProfilePage;
