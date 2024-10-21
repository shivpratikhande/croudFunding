import React, { useState } from 'react';
import { useStateContext } from '../context/index'; // Adjust the import according to your file structure
import { checkIfImage } from '../utils'; // Make sure this utility is correctly imported
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import FormField from '../component/FormField';
import { money } from '../assets';
import CustomButton from '../component/CustomButton';

const CreateCampaignForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign, connectWallet } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: '',
  });
  const navigate = useNavigate();

  const handleFormFieldChange = (fieldName,e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
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
    <div className='bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4'>
      {isLoading && "Loading..."}
      <div className='flex justify-center items-center flex-col rounded-[10px]'>
        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'>Start a Campaign</h1>
      </div>
      <form onSubmit={handleCreateCampaign} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField
          labelName="Story *"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>

        <FormField
          labelName="Campaign image *"
          placeholder="Place image URL of your campaign"
          inputType="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange('image', e)}
        />

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new campaign "
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaignForm;
