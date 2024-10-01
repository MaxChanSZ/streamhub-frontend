import React, { useState } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { createWatchParty } from "@/utils/api-client";
import { useAppContext } from "@/contexts/AppContext";

export type WatchPartyFormData = {
  partyName: string;
  accountID: number | undefined;
  password: string;
  scheduledDate: string;
  scheduledTime: string;
};

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className, ...props }) => (
  <label className={`block text-sm font-medium text-stone-50 mb-1 ${className}`} {...props}>
    {children}
  </label>
);

/**
 * CreateWatchPartyPage component is responsible for rendering the page where users can create a watch party.
 * It contains a form with input fields for the party name, date, and time, along with a submit button.
 *
 * @return {JSX.Element} The rendered CreateWatchPartyPage component.
 */
const CreateWatchPartyPage = () => {
  const [partyName, setPartyName] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [partyCode, setPartyCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAppContext();

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    const accountID = user?.id;
  
    if (!accountID) {
      setError('User not logged in. Please log in to create a watch party.');
      setIsLoading(false);
      return;
    }
  
    const formData: WatchPartyFormData = {
      partyName,
      accountID,
      password,
      scheduledDate,
      scheduledTime,
    };
  
    try {
      const response = await createWatchParty(formData);
      setPartyCode(response.code);
      console.log('Watch Party created:', response);
    } catch (error) {
      console.error('Error creating watch party:', error);
      setError('Failed to create watch party. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl text-white font-semibold mb-6 text-center font-alatsi">
        Create Watch Party
      </h2>
      <form onSubmit={onFormSubmit} className="space-y-4">
        <div>
          <Label htmlFor="partyName">Watch Party Name</Label>
          <Input
            id="partyName"
            type="text"
            placeholder="e.g., Horror Night"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            className="w-full font-alatsi"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Watchparty Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full font-alatsi"
            required
          />
        </div>
        <div>
          <Label htmlFor="scheduledDate">Date</Label>
          <Input
            id="scheduledDate"
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full font-alatsi"
            required
          />
        </div>
        <div>
          <Label htmlFor="scheduledTime">Time</Label>
          <Input
            id="scheduledTime"
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full font-alatsi"
            required
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          className="w-full text-base py-2 font-alatsi"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Watch Party'}
        </Button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      {partyCode && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>Your party code is: <strong>{partyCode}</strong></p>
          <p className="mt-2 text-sm">Share this code with your friends to invite them to your watch party!</p>
        </div>
      )}
    </div>
  );
};

export default CreateWatchPartyPage;
