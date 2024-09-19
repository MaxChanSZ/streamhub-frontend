import { Button } from "@/components/shadcn/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { useState } from "react";
import * as apiClient from "@/utils/api-client";
import { toast } from "@/components/shadcn/ui/use-toast";
import { useNavigate } from "react-router-dom";
export type WatchPartyFormData = {
  partyName: string;
  accountID: number | undefined;
};

/**
 * WatchPartyPage component is responsible for rendering the page where users can enter the watch party code.
 * It contains a form with a input field for the code and a submit button.
 *
 * @return {JSX.Element} The rendered WatchPartyPage component.
 */
const CreateWatchPartyPage = () => {
  var { user } = useAppContext();
  const navigate = useNavigate();

  const [partyName, setPartyName] = useState<string>('');
  const onFormSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Assuming you have an accountID from somewhere
    const accountID = user?.id; // Replace this with actual accountID

    const formData: WatchPartyFormData = {
      partyName,
      accountID,
    };

    console.log(partyName);
    console.log(accountID);

    try {
      const response = await apiClient.createWatchParty(formData);
      console.log('Watch party created successfully');
      navigate(`/watch-party/${response.code}`);
      // window.location.pathname = `/watch-party/${response.code}`;
    } catch (error) {
      console.error('Failed to create watch party:', error);
    }
  };

  return (
      <div>
        <h2 className="text-2xl text-white font-semibold px-4 text-center font-alatsi">
          Create Watch Party Page
        </h2>
        <form onSubmit={onFormSubmit}>
          <div className="sm:col-span-2">
            <label className="font-alatsi block text-md font-medium leading-6 text-stone-50">Watch Party Name</label>
            <div className="mt-2">
              <input type="text"
                     placeholder="Input Party Name eg. Horror Night"
                     value={partyName}
                     onChange={(e) => setPartyName(e.target.value)}
                     className="font-alatsi w-1/2 mr-2 rounded-md border-0 py-2 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
              <Button
                  type="submit"
                  variant="secondary"
                  className="col-span-2 text-base px-4 py-1 self-center font-alatsi"
              >Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
  );
};

export default CreateWatchPartyPage;