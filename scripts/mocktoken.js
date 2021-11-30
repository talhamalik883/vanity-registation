const hre = require("hardhat");
const { updateContractAddresses } = require("../utils/contractsManagement");
const network = hre.hardhatArguments.network;

async function main() {

  const initialSupply = ethers.utils.parseUnits("10000000", 18);
  const name = "Test Token";
  const symbol = "TT";

  let erc20Token = await hre.ethers.getContractFactory("MockToken");

  erc20Token = await erc20Token.deploy(initialSupply, name, symbol);
  await erc20Token.deployed();

  console.log("Contract deployed at:", erc20Token.address);

  // update contract address in config file
  updateContractAddresses(
    {
      MOCKTOKEN: erc20Token.address,
    },
    network,
  );

  console.log("************************************");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
