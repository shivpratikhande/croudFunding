import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import CountBox from '../component/CountBox';
import CustomButton from '../component/CustomButton';
import Loader from '../component/Loader';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';

// Extracted smaller components for better readability
const CampaignHeader = ({ image, target, amountCollected }) => (
  <div className="flex-1 flex-col">
    <img src={image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
    <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
      <div
        className="absolute h-full bg-[#4acd8d]"
        style={{ width: `${calculateBarPercentage(target, amountCollected)}%`, maxWidth: '100%' }}
      />
    </div>
  </div>
);

const CampaignStats = ({ remainingDays, target, amountCollected, donators }) => (
  <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
    <CountBox title="Days Left" value={remainingDays} />
    <CountBox title={`Raised of ${target}`} value={amountCollected} />
    <CountBox title="Total Backers" value={donators.length} />
  </div>
);

const CampaignStory = ({ description }) => (
  <div>
    <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>
    <div className="mt-[20px]">
      <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{description}</p>
    </div>
  </div>
);

const CampaignDonators = ({ donators }) => (
  <div>
    <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Donators</h4>
    <div className="mt-[20px] flex flex-col gap-4">
      {donators.length > 0 ? donators.map((item, index) => (
        <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
          <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">
            {index + 1}. {item.donator}
          </p>
          <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">
            {item.donation}
          </p>
        </div>
      )) : (
        <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
          No donators yet. Be the first one!
        </p>
      )}
    </div>
  </div>
);

const FundForm = ({ amount, setAmount, handleDonate }) => (
  <div className="flex-1">
    <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Fund</h4>
    <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
      <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
        Fund the campaign
      </p>
      <div className="mt-[30px]">
        <input
          type="number"
          placeholder="ETH 0.1"
          step="0.01"
          className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
          <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
            Back it because you believe in it.
          </h4>
          <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
            Support the project for no reward, just because it speaks to you.
          </p>
        </div>

        <CustomButton
          btnType="button"
          title="Fund Campaign"
          styles="w-full bg-[#8c6dfd]"
          handleClick={handleDonate}
        />
      </div>
    </div>
  </div>
);

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    try {
      const data = await getDonations(state.pId);
      setDonators(data);
      console.log(data)
    } catch (error) {
      console.error('Error fetching donators:', error);
    }
  };

  useEffect(() => {
    if (contract && address) {
      fetchDonators();
    }
  }, [contract, address]);

  const handleDonate = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        alert('Please enter a valid donation amount.');
        return;
      }

      setIsLoading(true);
      await donate(state.pId, amount);
      navigate('/');
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Failed to process donation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <CampaignHeader image={state.image} target={state.target} amountCollected={state.amountCollected} />
        <CampaignStats
          remainingDays={remainingDays}
          target={state.target}
          amountCollected={state.amountCollected}
          donators={donators}
        />
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <CampaignStory description={state.description} />
          <CampaignDonators donators={donators} />
        </div>
        <FundForm amount={amount} setAmount={setAmount} handleDonate={handleDonate} />
      </div>
    </div>
  );
};

export default CampaignDetails;
