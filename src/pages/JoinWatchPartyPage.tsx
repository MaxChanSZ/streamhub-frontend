import { Button } from "@/components/shadcn/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/shadcn/ui/alert-dialog";
import { Input } from "@/components/shadcn/ui/input";
import { useAppContext } from "@/contexts/AppContext";

/**
 * WatchPartyPage component is responsible for rendering the page where users can enter the watch party code.
 * It contains a form with a input field for the code and a submit button.
 *
 * @return {JSX.Element} The rendered WatchPartyPage component.
 */
const JoinWatchPartyPage = () => {
  var { isLoggedIn } = useAppContext();
  // const navigate = useNavigate();

  if (isLoggedIn) {
    return (
      <h2 className="text-2xl text-white font-semibold px-4 text-center font-alatsi">
        Create Watch Party Page
      </h2>
    );
  } else {
    return (
      <div className="flex flex-col justify-center text-white ">
        {/* Form for entering the watch party code */}
        <form className="flex flex-col justify-center">
          {/* Label for the input field */}
          <label className="text-center font-alatsi">
            {/* Heading for the input field */}
            <h2 className="text-2xl text-white px-4 text-center">
              Watch Party Code:
            </h2>
            {/* Input field for the code */}
            <input
              type="number"
              min={0}
              className="border rounded w-1/4 py-2 px-3.5 my-2 font-sans font-medium text-black text-lg text-center "
              // Placeholder for the input field
              placeholder="Enter Code"
            ></input>
          </label>
          {/* Submit button for the form */}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="secondary"
                className="text-base mx-2 px-4 py-1 self-center font-alatsi"
              >
                Submit
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[400px]">
              <AlertDialogHeader>
                <AlertDialogTitle>Enter your display name</AlertDialogTitle>
                <AlertDialogDescription>
                  Please enter a name in the input field below.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4 py-4">
                <Input autoFocus placeholder="Enter a value" />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Submit</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </div>
    );
  }
};

export default JoinWatchPartyPage;
