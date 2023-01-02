const TokenEth = artifacts.require('TokenEth.sol');
const TokenBsc = artifacts.require('TokenBsc.sol');
const AMMEthSide = artifacts.require('AMMEthSide.sol');
const AMMBscSide = artifacts.require('AMMBscSide.sol');

module.exports = async function (deployer, network, addresses) {
  if(network === 'ethTestnet') {
    const tokenBsc = await TokenBsc.deployed();
    console.log('Deploying eth side AMM');
    await deployer.deploy(AMMEthSide, tokenBsc.address);
    const ammEthSide = await AMMEthSide.deployed();
  }
  if(network === 'bscTestnet') {
    const tokenEth = await TokenEth.deployed();
    console.log('Deploying bsc side AMM');
    await deployer.deploy(AMMBscSide, tokenEth.address);
    const ammBscSide = await AMMBscSide.deployed();
  }
};