const { ethers } = require("hardhat")
const hre = require("hardhat")
const { items } = require("../src/items.json")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
    const [deployer] = await ethers.getSigners()

    const Cryptazone = await hre.ethers.getContractFactory("Cryptazone")
    const cryptazone = await Cryptazone.deploy()
    await cryptazone.deployed()

    console.log(`Deployed Cryptazone Contract at ${cryptazone.address}`)

    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
