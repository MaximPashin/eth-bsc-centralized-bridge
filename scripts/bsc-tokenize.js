const BridgeBscSide = artifacts.require('./BridgeBscSide.sol');


module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bridgeBscSide = await BridgeBscSide.deployed();
  console.log('Locking');
  await bridgeBscSide.lock(recipient, {value: 10000});
  console.log('Success');
  done();
}
