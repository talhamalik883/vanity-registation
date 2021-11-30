require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
const { removeConsoleLog } = require('hardhat-preprocessor');

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  networks: {
    hardhat: {
      forking: {
        enabled: process.env.FORKING === 'true',
        url: 'https://eth-kovan.alchemyapi.io/v2/7hXx5tOjA95V0sjNScp2g6Uf-RXq5cU6',
      },
      live: false,
      saveDeployments: true,
      tags: ['test', 'local'],
    }
  },

  mocha: {
    // enableTimeouts: false,
    timeout: 20000,
  },
  // solidity: "0.7.3",
  preprocess: {
    eachLine: removeConsoleLog(
      (bre) =>
        bre.network.name !== 'hardhat' && bre.network.name !== 'localhost',
    ),
  },
  solidity: {
    compilers: [
      {
        version: '0.8.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
  watcher: {
    compile: {
      tasks: ['compile'],
      files: ['./contracts'],
      verbose: true,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
