const fs = require('fs');
const Web3 = require('web3');

const infura_api_key = fs.readFileSync('./infura_api_key').toString().trim();
const quiknode_api_key = fs.readFileSync('./quiknode_api_key').toString().trim();
const adminPrivKey = fs.readFileSync('./private_key').toString().trim();

const BridgeEthSide = require('../build/contracts/BridgeEthSide.json');
const BridgeBscSide = require('../build/contracts/BridgeBscSide.json');

const web3Eth = new Web3('wss://goerli.infura.io/ws/v3/' + infura_api_key);
const web3Bsc = new Web3('https://bsc-testnet.public.blastapi.io');
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

const bridgeEthSide = new web3Eth.eth.Contract(
  BridgeEthSide.abi,
  BridgeEthSide.networks['5'].address
);

const bridgeBscSide = new web3Bsc.eth.Contract(
  BridgeBscSide.abi,
  BridgeBscSide.networks['97'].address
);

bridgeEthSide.events.Transfer(
  {fromBlock: "latest", filter: {step: '0'}}
)
.on('data', async event => {
  const { from, to, amount, date, nonce } = event.returnValues;
  console.log('Building unlock transaction');
  const tx = bridgeBscSide.methods.unlock(to, amount, nonce);
  const [gasPrice, gasCost] = await Promise.all([
    web3Bsc.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridgeBscSide.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  console.log('Sending transaction to other side');
  const receipt = await web3Bsc.eth.sendTransaction(txData);
  console.log('Transaction successfully transferred');
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
  `);
});

bridgeEthSide.events.Transfer(
  {fromBlock: "latest", filter:{step: '2'}}
)
.on('data', async event => {
  const { from, to, amount, date, nonce } = event.returnValues;
  console.log('Building mint transaction');
  const tx = bridgeBscSide.methods.mint(to, amount, nonce);
  const [gasPrice, gasCost] = await Promise.all([
    web3Bsc.eth.getGasPrice(),
    tx.estimateGas({from: admin}),
  ]);
  const data = tx.encodeABI();
  const txData = {
    from: admin,
    to: bridgeBscSide.options.address,
    data,
    gas: gasCost,
    gasPrice
  };
  console.log('Sending transaction to other side');
  const receipt = await web3Bsc.eth.sendTransaction(txData);
  console.log('Transaction successfully transferred');
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${amount} tokens
    - date ${date}
  `);
});