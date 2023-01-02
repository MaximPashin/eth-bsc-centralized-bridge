const BridgeEthSide = artifacts.require('./BridgeEthSide.sol');


module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bridgeEthSide = await BridgeEthSide.deployed();
  console.log('Burning');
  await bridgeEthSide.burn(recipient, 1000);
  console.log('Success');
  done();
}
