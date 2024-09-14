import React, { useContext, createContext, useState, useEffect } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0x31a12d7d9a658432374C38d1D90041C97FAc2e93'); // Ensure this contract address is correct
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
    
    const address = useAddress(); // Automatically fetches user's address
    const connect = useMetamask(); // Handles MetaMask connection

    // State to track whether MetaMask is installed and connected
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

    useEffect(() => {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            setIsMetaMaskInstalled(true);
        } else {
            console.error('MetaMask is not installed. Please install MetaMask.');
        }
    }, []);

    // Function to handle campaign creation
    const publishCampaign = async (form) => {
        if (!address) {
            console.error('Please connect to MetaMask to create a campaign.');
            return;
        }

        try {
            const data = await createCampaign({
                args: [
                    address, // owner
                    form.title, // title
                    form.description, // description
                    form.target,
                    new Date(form.deadline).getTime(), // deadline,
                    form.image,
                ],
            });

            console.log("contract call success", data)
        } catch (error) {
            console.log("contract call failure", error)
        }
    }

    // Function to get all campaigns
    const getCampaigns = async () => {
        try {
            const campaigns = await contract.call('getCampaigns');
            const parsedCampaigns = campaigns.map((campaign, i) => ({
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                target: ethers.utils.formatEther(campaign.target.toString()),
                deadline: campaign.deadline.toNumber(),
                amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
                image: campaign.image,
                pId: i
            }));
            return parsedCampaigns;
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        }
    }

    // Function to get user-specific campaigns
    const getUserCampaigns = async () => {
        try {
            const allCampaigns = await getCampaigns();
            const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);
            return filteredCampaigns;
        } catch (error) {
            console.error('Error fetching user campaigns:', error);
        }
    }

    // Function to get the number of campaigns owned by a specific user
    const getNumberOfCampaigns = async (campaignOwner) => {
        try {
            const allCampaigns = await getCampaigns();
            const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === campaignOwner);
            return filteredCampaigns.length;
        } catch (error) {
            console.error('Error fetching campaign count:', error);
        }
    }

    // Function to donate to a campaign
    const donate = async (pId, amount) => {
        if (!address) {
            console.error('Please connect to MetaMask to donate.');
            return;
        }

        try {
            const data = await contract.call("donateToCampaign", [pId], {
                value: ethers.utils.parseEther(amount)
            });
            return data;
        } catch (error) {
            console.error('Donation failed:', error);
        }
    }

    // Function to get donations for a specific campaign
    const getDonations = async (pId) => {
        try {
            const donations = await contract.call("getDonators", [pId]);
            const numberOfDonations = donations[0].length;

            const parsedDonations = [];
            for (let i = 0; i < numberOfDonations; i++) {
                parsedDonations.push({
                    donator: donations[0][i],
                    donation: ethers.utils.formatEther(donations[1][i].toString())
                });
            }

            return parsedDonations;
        } catch (error) {
            console.error('Error fetching donations:', error);
        }
    }

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                getNumberOfCampaigns,
                donate,
                getDonations,
                isMetaMaskInstalled, // Adding this state for MetaMask installation tracking
            }}
        >
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);
