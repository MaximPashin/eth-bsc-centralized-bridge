pragma solidity ^0.8.0;

import './AMMBase.sol';

contract AMMBscSide is AMMBase {
  constructor(address token) AMMBase(token) {}
}
