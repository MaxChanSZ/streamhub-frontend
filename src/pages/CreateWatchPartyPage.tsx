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
          <label>
            <h2>Watch Party Name</h2>
            <input 
              type="text" 
              placeholder="Input Party Name" 
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}>
              </input>
          </label>
          <Button 
            type="submit" 
            variant="secondary"
            className="text-base mx-2 px-4 py-1 self-center font-alatsi"
          >Submit
          </Button>
        </form>
      </div>
    );
};

export default CreateWatchPartyPage;
