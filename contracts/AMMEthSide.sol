pragma solidity ^0.8.0;

import './AMMBase.sol';

contract AMMEthSide is AMMBase {
  constructor(address token) AMMBase(token) {}
}
