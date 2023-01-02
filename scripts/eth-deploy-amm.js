const TokenBsc = artifacts.require('TokenBsc.sol');
const AMMEthSide = artifacts.require('AMMEthSide.sol');

module.exports = async done => {
    const tokenBsc = await TokenBsc.deployed();
    const ammEthSide = await AMMEthSide.deployed();
    console.log('approving');
    await tokenBsc.approve(ammEthSide.address, 1000);
    console.log('deploing');
    await ammEthSide.deployAMM({value: 500});
    console.log('success');
    done();
}