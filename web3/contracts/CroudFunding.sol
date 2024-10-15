// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CroudFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 =>Campaign) public campaigns;

    uint256 public numberOfCampaign = 0;

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _deadline, 
    uint256 _target, string memory _image ) public returns(uint256){

        Campaign storage campaign = campaigns[numberOfCampaign];

        require(campaign.deadline < block.timestamp, "this should be the date int the future");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target  = _target;
        campaign.image = _image;
        campaign.amountCollected = 0;

        numberOfCampaign++;

        return numberOfCampaign -1;

    }

    function donateCampaign(uint256 _id) public payable{
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,) = payable (campaign.owner).call{value:amount}("");

        if(sent){
            campaign.amountCollected = campaign.amountCollected + amount;
        }



    }

//0xe890D42AFd5EA1a8506F117A8c352937A164BaaA

    function getDonators(uint256 _id) view public returns(address[] memory,  uint256[] memory){
        return ( campaigns[_id].donators, campaigns[_id].donations);
    }


}
