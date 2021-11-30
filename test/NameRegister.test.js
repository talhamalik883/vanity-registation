/* eslint-disable no-unused-vars */
// We import Chai to use its asserting functions here.
const hre = require('hardhat');
const ethers = hre.ethers;
const { generatedWallets } = require('../utils/wallets');
const { JsonRpcProvider } = require('@ethersproject/providers');
const { expect } = require('chai');

const network = process.argv[4];

describe('*** Contract Testing ***', async function () {
  before(async function () {
    const provider = new JsonRpcProvider(process.env.PROVIDER_URL);

    this.signers = network
      ? generatedWallets(provider)
      : await ethers.getSigners();
    this.alice = this.signers[0]
    this.bob = this.signers[1]
  });
  beforeEach(async function () {

    let nameRegisterFactory = await hre.ethers.getContractFactory('NameRegister');
    this.nameRegisterdeployed = await nameRegisterFactory.deploy();
    await this.nameRegisterdeployed.deployed();

    const initialSupply = ethers.utils.parseUnits("10000000", 18);
    const name = "TestToken";
    const symbol = "TT";

    let erc20TokenFactory = await hre.ethers.getContractFactory("MockToken");

    this.erc20Token = await erc20TokenFactory.deploy(initialSupply, name, symbol);
    await this.erc20Token.deployed();

    await this.erc20Token.transfer(
        this.alice.address,
        ethers.utils.parseUnits("1000", 18)
    );

    await this.erc20Token.transfer(
        this.bob.address,
        ethers.utils.parseUnits("1000", 18)
    );
    
  });

  it('It should allow user to register vanity name', async function () {
      
        await this.erc20Token.connect(this.alice).approve(this.nameRegisterdeployed.address, ethers.utils.parseUnits("1000",18));

        await this.nameRegisterdeployed.connect(this.alice).registerRenewName("vanityName1", this.erc20Token.address)

        const contractBalance = ethers.utils.formatEther(await this.erc20Token.balanceOf(this.nameRegisterdeployed.address)).toString();

        expect(contractBalance).to.equal('1.1')

  })

    it('It should allow user to renew vanity name', async function () {
      
        await this.erc20Token.connect(this.alice).approve(this.nameRegisterdeployed.address, ethers.utils.parseUnits("1000",18));

        await this.nameRegisterdeployed.connect(this.alice).registerRenewName("vanityName1", this.erc20Token.address)

        // increate time

        const twoDay = 8 * 60 * 60

        await ethers.provider.send('evm_increaseTime', [twoDay]);
        await ethers.provider.send('evm_mine');

        await this.nameRegisterdeployed.connect(this.alice).registerRenewName("vanityName122", this.erc20Token.address);
        const contractBalance = ethers.utils.formatEther(await this.erc20Token.balanceOf(this.nameRegisterdeployed.address)).toString();
        expect(contractBalance).to.equal('2.4')

  })



    it('Sould Not allow user to Register allocated vanity name', async function () {
      
        await this.erc20Token.connect(this.alice).approve(this.nameRegisterdeployed.address, ethers.utils.parseUnits("1000",18));

        await this.nameRegisterdeployed.connect(this.alice).registerRenewName("vanity1", this.erc20Token.address);
        
        await this.erc20Token.connect(this.bob).approve(this.nameRegisterdeployed.address, ethers.utils.parseUnits("1000",18));
        
        await expect(this.nameRegisterdeployed.connect(this.bob).registerRenewName("vanity1", this.erc20Token.address)).to.be.revertedWith("NR: Name already alloted");


      })
 });
    

