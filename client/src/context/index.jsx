import React, { useContext, createContext } from "react";
import { useAddress, useContract, useContractWrite, useMetamask } from "@thirdweb-dev/react"
import { ethers } from "ethers";


const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract("0x3AD6a6061397D2944Ff232817047847D87fd6B4a")
  const { mutateAsync: createCampaign } = useContractWrite(contract, "createCampaign")

  const address = useAddress()
  const connect = useMetamask()

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign([
        address, //owner
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image
      ])

      console.log("successfully created contract", data)
    } catch (error) {
      console.log("contract call failure", error)

    }

  }

  return(
    <StateContext.Provider
    value={{
      address,
      contract,
      createCampaign:publishCampaign
    }}
    >
      {children}
    </StateContext.Provider>
  )

}

export const useStateContext = ()=> useContext(StateContext)