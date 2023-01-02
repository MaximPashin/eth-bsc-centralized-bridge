const BridgeEthSide = artifacts.require('./BridgeEthSide.sol');


module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bridgeEthSide = await BridgeEthSide.deployed();
  console.log('Locking');
  await bridgeEthSide.lock(recipient, {value: 10000});
  console.log('Success');
  done();
}
