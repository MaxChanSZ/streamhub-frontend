import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from "@/contexts/AppContext";
import { WatchParty } from './WatchPartyPage';
import WatchPartyForm from '@/components/WatchPartyForm';
import { Button } from '@/components/shadcn/ui/button';
import { updateWatchParty } from '@/utils/api-client';

export type UpdateWatchPartyForm = {
    partyName: string;
    accountId: number | undefined;
    scheduledDate: string;
    scheduledTime: string;
    watchPartyId: number;
  };

const ManageWatchPartyPage: React.FC = () => {
    const { user } = useAppContext();
    const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
    const [selectedWatchParty, setSelectedWatchParty] = useState<WatchPartyForm>({
        partyName: "",
        scheduledDate: "",
        scheduledTime: "",
        password: ""
    });
    const [newUpdatedWatchParty, setNewUpdatedWatchParty] = useState<WatchPartyForm>({
        partyName: "",
        scheduledDate: "",
        scheduledTime: "",
        password: ""
    });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayUpdateSuccessMsg, setDisplayUpdateSuccessMsg] = useState<boolean>(false);
    
    useEffect(() => {
        if (user) {
          fetchWatchParties();
        }
      }, [user]);

      function onSelectWatchParty(code: string) {
        setDisplayUpdateSuccessMsg(false);
        const watchparty: WatchParty = watchParties.filter(wp => wp.code == code)[0];
        setSelectedWatchParty({
            partyName: watchparty.partyName,
            scheduledDate: watchparty.scheduledDate,
            scheduledTime: watchparty.scheduledTime,
            password: watchparty.password,
            watchPartyId: watchparty.id
        })
        setNewUpdatedWatchParty({
            partyName: watchparty.partyName,
            scheduledDate: watchparty.scheduledDate,
            scheduledTime: watchparty.scheduledTime,
            password: watchparty.password,
            watchPartyId: watchparty.id
        });
    }

    function updateSelectedWatchParty(watchParty: WatchPartyForm) {
        setDisplayUpdateSuccessMsg(false);
        setNewUpdatedWatchParty(watchParty);
    }

    const getCanWatchPartyBeUpdated = (): boolean  => {
        if (selectedWatchParty.partyName != newUpdatedWatchParty.partyName ||
            selectedWatchParty.scheduledDate != newUpdatedWatchParty.scheduledDate ||
            selectedWatchParty.scheduledTime != newUpdatedWatchParty.scheduledTime
        ) {
            return true;
        } else {
            return false;
        }
    }

    const fetchWatchParties = async () => {
        try {
          if (user && user.id) {
            const response = await axios.get<WatchParty[]>(`http://localhost:8080/api/watch-party/get/${user.id}`);
            console.log("Retrieved watch parties:", response.data);
            setWatchParties(response.data);
          }
        } catch (error) {
          console.error('Error fetching watch parties:', error);
        }
    };

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
     
        const accountID = user?.id;
      
        if (!accountID) {
          setError('User not logged in. Please log in to update a watch party.');
          setIsLoading(false);
          return;
        }
    
        if (newUpdatedWatchParty.watchPartyId) {
            const formData: UpdateWatchPartyForm = {
                partyName: newUpdatedWatchParty.partyName,
                accountId: accountID,
                scheduledDate: newUpdatedWatchParty.scheduledDate,
                scheduledTime: newUpdatedWatchParty.scheduledTime,
                watchPartyId: newUpdatedWatchParty.watchPartyId
            };
            try {
                const response = await updateWatchParty(formData);
                if (response.id) {
                    setDisplayUpdateSuccessMsg(true);
                    setSelectedWatchParty(newUpdatedWatchParty);
                }
              } catch (error) {
                console.error('Error updating watch party:', error);
                setError('Failed to update watch party. Please try again.');
              } finally {
                setIsLoading(false);
              }
        }
      };

    return (
        <div className="max-w-md mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-6 text-white">Manage Watch Party</h1>
            <select
                onChange={(e) => onSelectWatchParty(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md"
            >
            <option value="">Select a watch party to manage and edit</option>
            {watchParties.map((party) => (
                <option key={party.id} value={party.code}>
                    {party.partyName} - {party.scheduledDate} {party.scheduledTime}
                </option>
            ))}
            </select>
            {newUpdatedWatchParty.partyName && 
                <form className="space-y-4" onSubmit={onFormSubmit}>
                    <WatchPartyForm 
                        watchParty={newUpdatedWatchParty}
                        setWatchParty={updateSelectedWatchParty}
                        hidePasswordField
                    />
                    {/* SUBMIT FORM BUTTON */}
                    <Button
                        type="button"
                        variant="default"
                        className="w-full text-base py-2 font-alatsi border"
                    >
                        Change Watch Party Password
                    </Button>
                    <Button
                        type="submit"
                        variant="secondary"
                        className="w-full text-base py-2 font-alatsi"
                        disabled={isLoading || !getCanWatchPartyBeUpdated()}
                    >
                        Update Watch Party
                    </Button>
                </form>
            }
            {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p>{error}</p>
                </div>
            )}
            {displayUpdateSuccessMsg && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    <p>Watch party is updated successfully!</p>
                </div>
            )}
        </div>
    );
};

export default ManageWatchPartyPage;







