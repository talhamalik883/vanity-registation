// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');
const { updateContractAddresses } = require('../utils/contractsManagement');
const network = hre.hardhatArguments.network;


async function main () {

  let nameRegister = await hre.ethers.getContractFactory('NameRegister');

  nameRegister = await nameRegister.deploy();
  await nameRegister.deployed();

  console.log('Contract deployed at:', nameRegister.address);

  // update contract address in config file
  updateContractAddresses(
    {
      NameRegister: nameRegister.address,
    },
    network,
  );
  
  console.log('************************************');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
