import { Label } from "@/pages/CreateWatchPartyPage";
import { Input } from "./shadcn/ui/input";
import React from "react";

export type WatchPartyForm = {
    partyName: string;
    scheduledDate: string;
    scheduledTime: string;
    password: string;
    watchPartyId?: number;
}
export interface WatchPartyProps {
  watchParty: WatchPartyForm
  setWatchParty: (watchParty: WatchPartyForm) => void;
  hidePasswordField?: boolean;
};

export const WatchPartyForm: React.FC<WatchPartyProps> = ({ watchParty, setWatchParty, hidePasswordField }) => {
    // WATCHPARTY FORM RENDERER
    return (
        <div id="watchparty-form" className="space-y-4">
            <div>
                <Label htmlFor="partyName">Watch Party Name</Label>
                <Input
                    id="partyName"
                    type="text"
                    placeholder="e.g., Horror Night"
                    value={watchParty.partyName}
                    onChange={(e) =>  setWatchParty({
                        ...watchParty,
                        partyName: e.target.value
                    })}
                    className="w-full font-alatsi"
                    required
                />
            </div>
            {!hidePasswordField &&
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Watchparty Password"
                        value={watchParty.password}
                        onChange={(e) =>  setWatchParty({
                            ...watchParty,
                            password: e.target.value
                        })}
                        className="w-full font-alatsi"
                        required
                    />
                </div>
            }
            <div>
                <Label htmlFor="scheduledDate">Date</Label>
                <Input
                    id="scheduledDate"
                    type="date"
                    value={watchParty.scheduledDate}
                    onChange={(e) =>  setWatchParty({
                        ...watchParty,
                        scheduledDate: e.target.value
                    })}
                    className="w-full font-alatsi"
                    required
                />
            </div>
            <div>
                <Label htmlFor="scheduledTime">Time</Label>
                <Input
                    id="scheduledTime"
                    type="time"
                    value={watchParty.scheduledTime}
                    onChange={(e) =>  setWatchParty({
                        ...watchParty,
                        scheduledTime: e.target.value
                    })}
                    className="w-full font-alatsi"
                    required
                />
            </div>
        </div>
    );
};

export default WatchPartyForm;