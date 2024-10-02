import { Button } from "@/components/shadcn/ui/button";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/shadcn/ui/alert-dialog";
import { Input } from "@/components/shadcn/ui/input";
import { useAppContext } from "@/contexts/AppContext";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/shadcn/ui/use-toast";

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
    const [ code, setCode ] = useState('');
    const [ password, setPassword ] = useState('');
    const navigate = useNavigate();

    const joinWatchParty = async (code: string, password: string) => {
      await axios
      .post(
        "http://localhost:8080/api/watch-party/join",
        {
          "code": code,
          "password": password
        }
      )
      .then(
        ( response ) => {
          if ( response.status == 200 ) {
            if (response.data.token) {
              localStorage.setItem("watchparty-token", JSON.stringify(response.data.token));
              // once the token has been set, redirect to the watch party page with the token
              // already stored in the local storage
              console.log("Video source is: " + response.data.videoSource);
              navigate(`/watch-party/${code}`);
            }
          }
        } 
      )
      .catch(
        ( error ) =>  {
          toast({
            title: "Login Error",
            description: error.response ? error.response.data : null,
            variant: "destructive",
          });
          console.log(error);
        }
      )
    }

    const handleSubmit = async (e : any) => {
      e.preventDefault();
      // make an api call to the backend with the form details to join the watch party
      await joinWatchParty(code, password);

      // navigate(`watch-party/${code}`);
    }

    return (
      <div className="flex flex-col justify-center text-white ">
        {/* Form for entering the watch party code */}
        <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
          {/* Label for the input field */}
          <label className="text-center font-alatsi">
            {/* Heading for the input field */}
            <h2 className="text-2xl text-white px-4 text-center">
              Watch Party Code:
            </h2>
            {/* Input field for the code */}
            <input
              type="text"
              className="border rounded w-1/4 py-2 px-3.5 my-2 font-sans font-medium text-black text-lg text-center "
              placeholder="Enter Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            ></input>
            <br></br>
            <input
              type="password"
              className="border rounded w-1/4 py-2 px-3.5 my-2 font-sans font-medium text-black text-lg text-center "
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </label>
          {/* Submit button for the form */}

          <Button
                type="submit"
                variant="secondary"
                className="text-base mx-2 px-4 py-1 self-center font-alatsi"
              >
                Submit
          </Button>

          {/* <AlertDialog>
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
          </AlertDialog> */}

        </form>
      </div>
    );
  } else {
    const [ code, setCode ] = useState('');
    const [ password, setPassword ] = useState('');

    const joinWatchParty = async (code: string, password: string) => {
      await axios
      .post(
        "http://localhost:8080/api/watch-party/join",
        {
          "code": code,
          "password": password
        }
      )
      .then(
        ( response ) => {
          console.log(response.data)
          console.log(response.status)
          if ( response.status == 200 ) {
            if (response.data.token) {
              localStorage.setItem("watchparty-token", JSON.stringify(response.data.token));
              // once the token has been set, redirect to the watch party page with the token
              // already stored in the local storage
              //navigate(`watch-party/${code}`)
            }
          }
        } 
      
      )
      .catch(
        ( error ) =>  {
          console.log("Error encountered" + error)
        }
      )
    }

    const handleSubmit = (e : any) => {
      e.preventDefault();
      // make an api call to the backend with the form details to join the watch party
      joinWatchParty(code, password);
      
    }

    return (
      <div className="flex flex-col justify-center text-white ">
        {/* Form for entering the watch party code */}
        <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
          {/* Label for the input field */}
          <label className="text-center font-alatsi">
            {/* Heading for the input field */}
            <h2 className="text-2xl text-white px-4 text-center">
              Watch Party Code:
            </h2>
            {/* Input field for the code */}
            <input
              type="text"
              className="border rounded w-1/4 py-2 px-3.5 my-2 font-sans font-medium text-black text-lg text-center "
              placeholder="Enter Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            ></input>
            <br></br>
            <input
              type="password"
              className="border rounded w-1/4 py-2 px-3.5 my-2 font-sans font-medium text-black text-lg text-center "
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </label>
          {/* Submit button for the form */}

          <Button
                type="submit"
                variant="secondary"
                className="text-base mx-2 px-4 py-1 self-center font-alatsi"
              >
                Submit
          </Button>

          {/* <AlertDialog>
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
          </AlertDialog> */}

        </form>
      </div>
    );
  }
};

export default JoinWatchPartyPage;
