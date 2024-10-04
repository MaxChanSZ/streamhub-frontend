import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from "@/contexts/AppContext";

interface WatchParty {
  id: number;
  partyName: string;
  scheduledDate: string;
  scheduledTime: string;
  code: string; 
  createdDate: number[]; 
  password: string;
}

const SendEmailPage: React.FC = () => {
  const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
  const [selectedParty, setSelectedParty] = useState<string>('');
  const [emailAddresses, setEmailAddresses] = useState<string>('');
  const [additionalMessage, setAdditionalMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const { user } = useAppContext();

  useEffect(() => {
    if (user) {
      fetchWatchParties();
    }
  }, [user]);

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

  const generateEmailSubject = (party: WatchParty) => {
    return `Invitation to Watch Party: ${party.partyName}`;
  };

  const generateEmailBody = (party: WatchParty, additionalMessage: string) => {
    const partyLink = `http://localhost:5173/watch-party/${party.code}`; 
    return `
      You are invited to join our Watch Party!

      Event Details:
      - Party Name: ${party.partyName}
      - Date: ${party.scheduledDate}
      - Time: ${party.scheduledTime}
      - Password: ${party.password}
      - Party Link: ${partyLink}

      To join the watch party, please click on the link above or enter the party code: ${party.code}

      ${additionalMessage}

      We hope to see you there!
    `.trim();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('Sending...');

    const selectedPartyDetails = watchParties.find(party => party.id.toString() === selectedParty);
    if (!selectedPartyDetails) {
      setStatus('Error: No watch party selected');
      return;
    }

    console.log("Selected party details:", selectedPartyDetails);

    const emailList = emailAddresses.split(',').map(email => email.trim());
    const emailSubject = generateEmailSubject(selectedPartyDetails);
    const emailBody = generateEmailBody(selectedPartyDetails, additionalMessage);

    console.log("Email subject:", emailSubject);
    console.log("Email body:", emailBody);

    try {
      await axios.post('http://localhost:8080/api/send-watch-party-email', {
        partyId: selectedParty,
        emailAddresses: emailList,
        subject: emailSubject,
        body: emailBody
      });
      setStatus('Invitations sent successfully!');
      setSelectedParty('');
      setEmailAddresses('');
      setAdditionalMessage('');
    } catch (error) {
      console.error('Error sending invitations:', error);
      setStatus('Failed to send invitations. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Send Watch Party Invitation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="watchParty" className="block text-sm font-medium text-gray-300 mb-1">
            Select Watch Party:
          </label>
          <select
            id="watchParty"
            value={selectedParty}
            onChange={(e) => setSelectedParty(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md"
            required
          >
            <option value="">Select a watch party</option>
            {watchParties.map((party) => (
              <option key={party.id} value={party.id.toString()}>
                {party.partyName} - {party.scheduledDate} {party.scheduledTime} (Code: {party.code})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="emailAddresses" className="block text-sm font-medium text-gray-300 mb-1">
            Email Addresses (comma-separated):
          </label>
          <input
            type="text"
            id="emailAddresses"
            value={emailAddresses}
            onChange={(e) => setEmailAddresses(e.target.value)}
            required
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md"
            placeholder="email1@example.com, email2@example.com"
          />
        </div>
        <div>
          <label htmlFor="additionalMessage" className="block text-sm font-medium text-gray-300 mb-1">
            Additional Message (optional):
          </label>
          <textarea
            id="additionalMessage"
            value={additionalMessage}
            onChange={(e) => setAdditionalMessage(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md h-32"
            placeholder="Add any additional information or personal message here."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send Invitations
        </button>
      </form>
      {status && (
        <p className="mt-4 text-center text-sm font-medium text-green-500">
          {status}
        </p>
      )}
    </div>
  );
};

export default SendEmailPage;







