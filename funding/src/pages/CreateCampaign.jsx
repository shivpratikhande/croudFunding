import React, { useState } from 'react';
import { useStateContext } from '../context/index'; // Adjust the import according to your file structure
import { checkIfImage } from '../utils'; // Make sure this utility is correctly imported
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

const CreateCampaignForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign, connectWallet } = useStateContext();
  const [form, setForm] = useState({
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateCampaign = async () => {
    try {
      await connectWallet(); // Ensure the wallet is connected before proceeding

      checkIfImage(form.image, async (exists) => {
        if (exists) {
          setIsLoading(true);
          try {
            await createCampaign(form);
            navigate('/'); // Replace with your desired path after successful creation
          } catch (error) {
            console.error('Error creating campaign:', error);
            alert('Error creating campaign. Please try again.');
          } finally {
            setIsLoading(false);
          }
        } else {
          alert('Provide a valid image URL');
          setForm({ ...form, image: '' });
        }
      });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl text-black mx-auto bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Create Campaign</h1>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-200"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-200"
        rows="4"
      />
      <input
        type="text"
        name="target"
        placeholder="Target Amount in ETH"
        value={form.target}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-200"
      />
      <input
        type="datetime-local"
        name="deadline"
        placeholder="Deadline"
        value={form.deadline}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-200"
      />
      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={form.image}
        onChange={handleInputChange}
        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-200"
      />
      <button
        onClick={handleCreateCampaign}
        disabled={isLoading}
        className={`w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-200 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Creating...' : 'Create Campaign'}
      </button>
    </div>
  );
};

export default CreateCampaignForm;
