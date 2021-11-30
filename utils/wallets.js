// const hre = require('hardhat');
const ethers = require('ethers');

// List of private keys used for interacting the chains
const privateKeys = [
  '',
  '',
];

function generatedWallets (provider) {
  return privateKeys.map((key) => {
    return new ethers.Wallet(key, provider);
  });
}

module.exports = {
  generatedWallets,
};
