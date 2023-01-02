pragma solidity ^0.8.0;

import './IToken.sol';

contract BridgeBase {
  address public admin;
  IToken public token;
  uint public nonce;
  mapping(uint => bool) public processedNonces;

  enum Step { Burn, Mint, Lock, Unlock }
  event Transfer(
    address from,
    address to,
    uint amount,
    uint date,
    uint nonce,
    Step indexed step
  );

  constructor(address _token) {
    admin = msg.sender;
    token = IToken(_token);
  }

  function burn(address to, uint amount) external {
    token.burn(to, amount);
    emit Transfer(
      msg.sender,
      to,
      amount,
      block.timestamp,
      nonce,
      Step.Burn
    );
    nonce++;
  }

  function mint(address to, uint amount, uint otherChainNonce) external {
    require(msg.sender == admin, 'only admin');
    require(processedNonces[otherChainNonce] == false, 'transfer already processed');
    processedNonces[otherChainNonce] = true;
    token.mint(to, amount);
    emit Transfer(
      msg.sender,
      to,
      amount,
      block.timestamp,
      otherChainNonce,
      Step.Mint
    );
  }

  function lock(address to) external payable {
    uint amount = msg.value;
    emit Transfer(
      msg.sender,
      to,
      amount,
      block.timestamp,
      nonce,
      Step.Lock
    );
    nonce++;
  }

  function unlock(address to, uint amount, uint otherChainNonce) external {
    require(msg.sender == admin, 'only admin');
    require(processedNonces[otherChainNonce] == false, 'transfer already processed');
    processedNonces[otherChainNonce] = true;
    payable(to).transfer(amount);
    emit Transfer(
      msg.sender,
      to,
      amount,
      block.timestamp,
      otherChainNonce,
      Step.Unlock
    );
  }
}
