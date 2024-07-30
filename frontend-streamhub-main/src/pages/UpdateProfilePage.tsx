const UpdateProfilePage = () => {
  const inputFieldFormat =
    "border rounded w-full py-2 px-3.5 my-2 font-normal text-black text-lg";

  return (
    <form className="text-white align-center font-bold px-4 py-4">
      <h2 className="text-3xl my-4">Update particulars</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="flex-1">
          Username
          <input className={inputFieldFormat}></input>
        </label>
        <label className="flex-1">
          Email Address
          <input className={inputFieldFormat}></input>
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <label className="flex-1">
          Password
          <input className={inputFieldFormat}></input>
        </label>
        <label className="flex-1">
          Confirm Password
          <input className={inputFieldFormat}></input>
        </label>
      </div>
    </form>
  );
};

export default UpdateProfilePage;
