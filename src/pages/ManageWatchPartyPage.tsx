import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from "@/contexts/AppContext";
import { WatchParty } from './WatchPartyPage';
import WatchPartyForm, { WatchPartyProps } from '@/components/WatchPartyForm';
import { Button } from '@/components/shadcn/ui/button';
import { updateWatchParty, updateWatchPartyPassword } from '@/utils/api-client';
import { Label } from './CreateWatchPartyPage';
import { Input } from '@/components/shadcn/ui/input';

export type UpdateWatchPartyForm = {
    partyName: string;
    accountId: number | undefined;
    scheduledDate: string;
    scheduledTime: string;
    watchPartyId: number;
};

export type UpdateWatchPartyPasswordForm = {
    password: string;
    accountId: number | undefined;
    watchPartyId: number;
};

type AlertMessages = {
    type: "success" | "error",
    message: string
}

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [displayPasswordChange, setDisplayPasswordChange] = useState<boolean>(false);
    const [alertMessages, setAlertMessages] = useState<AlertMessages|null>(null);
    
    useEffect(() => {
        if (user) {
          fetchWatchParties();
        }
      }, [user]);

      function onSelectWatchParty(code: string) {
        setAlertMessages(null);
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
            password: "",
            watchPartyId: watchparty.id
        });
    }

    function updateSelectedWatchParty(watchParty: WatchPartyForm) {
        setAlertMessages(null);
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
            setAlertMessages({type: "error", message: "User not logged in. Please log in to update a watch party."});
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
                    setAlertMessages({type: "success", message: "Watch party is updated successfully!"});
                    setSelectedWatchParty(newUpdatedWatchParty);
                }
              } catch (error) {
                    console.error('Error updating watch party:', error);
                    setAlertMessages({type: "error", message: "Failed to update watch party. Please try again."});
              } finally {
                    setIsLoading(false);
              }
        }
      };

      const onPasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
     
        const accountID = user?.id;
      
        if (!accountID) {
            setAlertMessages({type: "error", message: "User not logged in. Please log in to update a watch party."});
            setIsLoading(false);
            return;
        }

        // prevent password update when same
        if (newUpdatedWatchParty.password == selectedWatchParty.password) {
            setAlertMessages({type: "error", message: "New password is same as previous password. Please try another password."});
            setIsLoading(false);
            return;
        }
    
        if (newUpdatedWatchParty.watchPartyId) {
            const formData: UpdateWatchPartyPasswordForm = {
                password: newUpdatedWatchParty.password,
                accountId: accountID,
                watchPartyId: newUpdatedWatchParty.watchPartyId
            };
            try {
                const response = await updateWatchPartyPassword(formData);
                if (response.id) {
                    setAlertMessages({type: "success", message: "Watch party password is updated successfully!"});
                    setSelectedWatchParty(newUpdatedWatchParty);
                }
              } catch (error) {
                console.error('Error updating watch party:', error);
                setAlertMessages({type: "error", message: "Failed to update watch party. Please try again."});
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
            {newUpdatedWatchParty.watchPartyId &&
                <div className="space-y-4">
                <form className="space-y-4" onSubmit={onFormSubmit}>
                    <WatchPartyForm 
                        watchParty={newUpdatedWatchParty}
                        setWatchParty={updateSelectedWatchParty}
                        hidePasswordField
                    />
                     {/* SUBMIT FORM BUTTON */}
                    <Button
                        type="submit"
                        variant="secondary"
                        className="w-full text-base py-2 font-alatsi"
                        disabled={isLoading || !getCanWatchPartyBeUpdated()}
                    >
                        Update Watch Party
                    </Button>
                </form>
                {!displayPasswordChange &&
                    <Button
                        type="button"
                        variant="default"
                        className="w-full text-base py-2 font-alatsi border"
                        onClick={() =>  setDisplayPasswordChange(true)}
                    >
                        Change Watch Party Password
                    </Button>
                }
                {displayPasswordChange &&
                    <form className="space-y-4" onSubmit={onPasswordUpdate}>
                        <ChangePasswordField watchParty={newUpdatedWatchParty} setWatchParty={setNewUpdatedWatchParty}/>
                        <Button
                            type="submit"
                            variant="default"
                            className="w-full text-base py-2 font-alatsi border"
                        >
                            Update Watch Party Password
                        </Button>
                    </form>
                }
                </div>
            }
            {alertMessages?.type == "error" && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p>{alertMessages.message}</p>
                </div>
            )}
            {alertMessages?.type == "success" && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    <p>{alertMessages.message}</p>
                </div>
            )}
        </div>
    );
};

const ChangePasswordField: React.FC<WatchPartyProps> = ({ watchParty, setWatchParty }) => {
    return (
        <div>
            <Label htmlFor="password">Password</Label>
            <Input
                id="password"
                type="password"
                placeholder="New Password for Watchparty"
                value={watchParty.password}
                onChange={(e) =>  setWatchParty({
                    ...watchParty,
                    password: e.target.value
                })}
                className="w-full font-alatsi"
                required
            />
        </div>
    );
};

export default ManageWatchPartyPage;







