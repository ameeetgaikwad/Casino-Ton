// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CasinoBank is Ownable {
    mapping(address => uint256) public balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    
    constructor() Ownable(msg.sender) {}

    
    receive() external payable {
        deposit();
    }

    
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero.");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    
    function withdraw(uint256 amount) public {
        require(amount <= balances[msg.sender], "Insufficient balance.");
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    
    function withdrawAll() public onlyOwner {
        uint256 totalBalance = address(this).balance;
        require(totalBalance > 0, "No funds to withdraw.");
        payable(owner()).transfer(totalBalance);
    }

    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
