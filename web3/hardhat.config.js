module.exports = {
  solidity: {
    version: "0.8.9",
    defaultNetwork: "sepolia",
    networks: {
      hardhat: {},
      sepolia: {
        url: "https://eth-sepolia.g.alchemy.com/v2/demo",
        accounts:[`0x${process.env.PRIVATE_KEY}`]
      }
    },
    settings:{
      optimizer:{
        enabled:true,
        runs:200,
      }
    }
  }
}