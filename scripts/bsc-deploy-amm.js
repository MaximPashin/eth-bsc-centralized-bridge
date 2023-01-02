const TokenEth = artifacts.require('TokenEth.sol');
const AMMBscSide = artifacts.require('AMMBscSide.sol');

module.exports = async done => {
    const tokenEth = await TokenEth.deployed();
    const ammBscSide = await AMMBscSide.deployed();
    console.log('approving');
    await tokenEth.approve(ammBscSide.address, 500);
    console.log('deploing');
    await ammBscSide.deployAMM({value: 1000});
    console.log('success');
    done();
}