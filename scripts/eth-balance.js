module.exports = async done => {
  const [sender, _] = await web3.eth.getAccounts();
  var balance = await web3.eth.getBalance(sender);
  console.log(balance.toString());
  done();
}
