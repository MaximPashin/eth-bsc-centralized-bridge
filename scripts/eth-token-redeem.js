const BridgeBscSide = artifacts.require('./BridgeBscSide.sol');


module.exports = async done => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bridgeBscSide = await BridgeBscSide.deployed();
  console.log('burning');
  await bridgeBscSide.burn(recipient, 1000);
  console.log('success');
  done();
}
