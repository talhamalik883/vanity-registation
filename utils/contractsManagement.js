const fs = require('fs');
const path = require('path');

async function updateContractAddresses (contractAddresses = {}, network) {
  try {
    const dataInFile = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../config.json'), 'utf8'),
    );

    // update provided contract address in file
    for (const property in contractAddresses) {
      dataInFile[network][property] = contractAddresses[property];
    }
    // save updated changes in file
    fs.writeFileSync(
      path.resolve(__dirname, '../config.json'),
      JSON.stringify(dataInFile),
    );
  } catch (error) {
    console.log('error ', error);
  }
}

module.exports = {
  updateContractAddresses,
};
