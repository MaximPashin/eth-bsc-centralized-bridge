const TokenEth = artifacts.require('TokenEth.sol');
const TokenBsc = artifacts.require('TokenBsc.sol');
const BridgeEthSide = artifacts.require('BridgeEthSide.sol');
const BridgeBscSide = artifacts.require('BridgeBscSide.sol');

module.exports = async function (deployer, network, addresses) {
  if(network === 'ethTestnet') {
    console.log('Deploying bsc token');
    await deployer.deploy(TokenBsc);
    const tokenBsc = await TokenBsc.deployed();
    console.log('Deploying eth side bridge');
    await deployer.deploy(BridgeEthSide, tokenBsc.address);
    const bridgeEthSide = await BridgeEthSide.deployed();
    console.log('Transferring token admin rights to the bridge');
    await tokenBsc.updateAdmin(bridgeEthSide.address);
  }
  if(network === 'bscTestnet') {
    console.log('Deploying eth token');
    await deployer.deploy(TokenEth);
    const tokenEth = await TokenEth.deployed();
    console.log('Deploying bsc side bridge');
    await deployer.deploy(BridgeBscSide, tokenEth.address);
    const bridgeBscSide = await BridgeBscSide.deployed();
    console.log('Transferring token admin rights to the bridge');
    await tokenEth.updateAdmin(bridgeBscSide.address);
  }
};
