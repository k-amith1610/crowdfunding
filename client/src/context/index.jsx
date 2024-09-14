import React, { useContext, createContext, useState, useEffect } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0x31a12d7d9a658432374C38d1D90041C97FAc2e93'); // Contract address
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');

    const address = useAddress(); // Fetches user's address
    const connect = useMetamask(); // Handles MetaMask connection

    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            setIsMetaMaskInstalled(true); // MetaMask is installed
        } else {
            setIsMetaMaskInstalled(false);
            console.error('MetaMask is not installed.');
        }
    }, []);

    const publishCampaign = async (form) => {
        if (!address) {
            console.error('Connect to MetaMask to create a campaign.');
            return;
        }

        try {
            const data = await createCampaign({
                args: [
                    address,
                    form.title,
                    form.description,
                    form.target,
                    new Date(form.deadline).getTime(),
                    form.image,
                ],
            });
            console.log("Campaign created successfully:", data);
        } catch (error) {
            console.error("Error creating campaign:", error);
        }
    };

    const getCampaigns = async () => {
        try {
            const campaigns = await contract.call('getCampaigns');
            return campaigns.map((campaign, i) => ({
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                target: ethers.utils.formatEther(campaign.target.toString()),
                deadline: campaign.deadline.toNumber(),
                amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
                image: campaign.image,
                pId: i,
            }));
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        }
    };

    const getUserCampaigns = async () => {
        try {
            const allCampaigns = await getCampaigns();
            return allCampaigns.filter((campaign) => campaign.owner === address);
        } catch (error) {
            console.error("Error fetching user campaigns:", error);
        }
    };

    const donate = async (pId, amount) => {
        if (!address) {
            console.error('Connect to MetaMask to donate.');
            return;
        }

        try {
            const data = await contract.call("donateToCampaign", [pId], {
                value: ethers.utils.parseEther(amount)
            });
            return data;
        } catch (error) {
            console.error('Error donating to campaign:', error);
        }
    };

    const getDonations = async (pId) => {
        try {
            const donations = await contract.call("getDonators", [pId]);
            const numberOfDonations = donations[0].length;

            const parsedDonations = [];
            for (let i = 0; i < numberOfDonations; i++) {
                parsedDonations.push({
                    donator: donations[0][i],
                    donation: ethers.utils.formatEther(donations[1][i].toString()),
                });
            }
            return parsedDonations;
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    };

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonations,
                isMetaMaskInstalled,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
