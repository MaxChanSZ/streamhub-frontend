import { Button } from "@/components/shadcn/ui/button";

const WatchPartyPage = () => {
  return (
    <div className="flex flex-col justify-center text-white ">
      <form className="flex flex-col justify-center">
        <label className="text-center flex-1 font-alatsi">
          Watch Party Code:
          <input
            type="number"
            min={0}
            className="border rounded w-full py-2 px-3.5 my-2 font-sans font-medium text-black text-lg text-center"
          ></input>
        </label>
        <Button
          variant="secondary"
          className="text-base mx-2 px-4 py-1 w-1/4 self-center"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default WatchPartyPage;
