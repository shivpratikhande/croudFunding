import React from 'react';
import Sidebar from './component/Sidebar';
import Navbar from './component/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetails from './pages/CampaignDetails';
import { Route, Routes } from 'react-router-dom';
import { StateContextProvider } from './context';

/* export const client = createThirdwebClient({
  clientId: "9bcf5d2f319d5a16711a992331b89f67"
}); */

/* export const contract = getContract({
  client,
  chain: defineChain(11155111),
  address: "0x3AD6a6061397D2944Ff232817047847D87fd6B4a"
});
 */
function App() {
  return (
    <StateContextProvider>
      <div className="relative sm:-8 p-4 text-white bg-[#13131a] min-h-screen flex flex-row">
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-campaign" element={<CreateCampaign />} />
            <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          </Routes>
        </div>


      </div>
    </StateContextProvider>


  );
}

export default App;
