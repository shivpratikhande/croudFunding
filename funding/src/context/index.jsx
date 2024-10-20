import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const contractAddress = "0x3AD6a6061397D2944Ff232817047847D87fd6B4a";
  const contractABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "campaigns",
      "outputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "target",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "deadline",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amountCollected",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "image",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_deadline",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_target",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_image",
          "type": "string"
        }
      ],
      "name": "createCampaign",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "donateCampaign",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCampaigns",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "target",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "deadline",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amountCollected",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "image",
              "type": "string"
            },
            {
              "internalType": "address[]",
              "name": "donators",
              "type": "address[]"
            },
            {
              "internalType": "uint256[]",
              "name": "donations",
              "type": "uint256[]"
            }
          ],
          "internalType": "struct CroudFunding.Campaign[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getDonators",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "numberOfCampaign",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];


  useEffect(() => {
    // Initialize provider and contract
    const initProvider = async () => {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      console.log(provider)


      const signer = web3Provider.getSigner();
      setSigner(signer);

      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(contractInstance);
    };

    initProvider();
  }, []);

  // Function to connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required to connect your wallet.");
      return;
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      setSigner(signer);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Function to create a new campaign (Write function)
  const createCampaign = async (form) => {
    if (!contract) {
      console.error("Contract is not available.");
      return;
    }

    try {
      // Extract the necessary fields from the form object
      const { title, description, target, deadline, image } = form;

      // Get the owner's address (signer's address)
      const address = await signer.getAddress();

      // Parse target value to wei (Ether)
      const parsedTarget = ethers.utils.parseEther(target);

      // Convert deadline to timestamp (milliseconds)
      const parsedDeadline = new Date(deadline).getTime();

      // Call the createCampaign function on the contract
      const transaction = await contract.createCampaign(
        address, // owner's address
        title,
        description,
        parsedTarget, // parsed target amount in wei
        parsedDeadline, // timestamp of the deadline
        image
      );

      // Wait for the transaction to be mined
      await transaction.wait();

      console.log("Campaign created successfully:", transaction);
      // Optionally, refresh the campaigns list after creation
      await getCampaigns();
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  // Function to fetch campaigns from the contract (Read function)
  const getCampaigns = async () => {
    try {
      const campaigns = await contract.getCampaigns();
      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toString(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
        image: campaign.image,
        pId: i,
      }));

      console.log("Fetched campaigns:", parsedCampaigns);
      return parsedCampaigns;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  };

  return (
    <StateContext.Provider
      value={{
        connectWallet,
        createCampaign,
        getCampaigns,
        provider,
        signer,
        contractAddress,
        contract,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom hook for accessing state context
export const useStateContext = () => useContext(StateContext);
