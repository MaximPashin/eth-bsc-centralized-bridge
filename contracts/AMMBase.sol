pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract AMMBase {
  address public admin;
  IERC20 public token;
  bool public deploy_stage = true;
  uint public k;
  uint public amount_coins;
  uint public amount_tokens;
  uint public rate_decimals = 5;
  uint public rate;

  constructor(address _token) {
    admin = msg.sender;
    token = IERC20(_token);
  }

  function deployAMM() external payable {
    require(msg.sender == admin && deploy_stage);
    amount_coins = msg.value;
    amount_tokens = token.allowance(msg.sender, address(this));
    k = amount_coins * amount_tokens;
    rate = amount_tokens*(10**rate_decimals)/amount_coins;
    token.transferFrom(msg.sender, address(this), amount_tokens);
    deploy_stage = false;
  }

  function addLiquidity() external payable {
    require(!deploy_stage);
    uint coins = msg.value;
    uint tokens = token.allowance(msg.sender, address(this));
    token.transferFrom(msg.sender, address(this), tokens);
    rate = amount_tokens*(10**rate_decimals)/amount_coins;
    uint given_rate = tokens*(10**rate_decimals)/coins;
    if(rate < given_rate){
      uint new_tokens = rate * coins;
      new_tokens /= 10**rate_decimals;
      token.approve(msg.sender, tokens - new_tokens);
      tokens = new_tokens;
    }
    if(rate > given_rate){
      uint new_coins = (10**rate_decimals)*tokens/rate;
      payable(msg.sender).transfer(coins - new_coins);
      coins = new_coins;
    }
    amount_coins += coins;
    amount_tokens += tokens;
    k = amount_coins * amount_tokens;
  }

  function tokens_to_coins(address to) external {
    require(!deploy_stage);
    uint amount = token.allowance(msg.sender, address(this));
    require(amount != 0);
    uint buyed_coins = amount_coins - k/(amount_tokens + amount);
    amount_coins -= buyed_coins;
    amount_tokens += amount;
    rate = amount_tokens*(10**rate_decimals)/amount_coins;
    token.transferFrom(msg.sender, address(this), amount);
    payable(to).transfer(buyed_coins);
  }

  function coins_to_tokens(address to) external payable {
    require(!deploy_stage);
    uint amount = msg.value;
    require(amount != 0);
    uint buyed_tokens = amount_tokens - k/(amount_coins + amount);
    amount_coins += amount;
    amount_tokens -= buyed_tokens;
    rate = amount_tokens*(10**rate_decimals)/amount_coins;
    token.approve(to, buyed_tokens);
  }
}
