// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NameRegister is Ownable {
    struct Names {
        address user;
        address token;
        uint256 nameCost;
        uint256 expiryTime;
        bool isAlloted;
    }

    event NameRegistered(
        string name,
        uint256 amount,
        address indexed user,
        uint256 expiryTime
    );
    event WithdrawToken(
        address tokenAddress,
        address walletAddress,
        uint256 withdrawAmount
    );

    uint256 private constant costPerChar = 100000000000000000; // 0.1 Mock token
    uint256 private constant minLockTime = 1 days;
    uint256 private feeCollected = 0;

    mapping(string => Names) private registeredNames;

    // this function let user register/renew vanity name
    function registerRenewName(string memory name, address tokenAddress)
        external
        returns (bool)
    {
        // delete name registration if the time is expired

        if (block.timestamp > registeredNames[name].expiryTime) {
            delete registeredNames[name];
        }

        // this statement ensure renewal of name ownership
        if (registeredNames[name].user != msg.sender) {
            require(
                registeredNames[name].isAlloted == false,
                "NR: Name already alloted"
            );
        }

        // calculate cost base on name length
        bytes memory nameBytes = bytes(name);
        uint256 nameCost = nameBytes.length * costPerChar;

        // check allowance provided for registring name
        uint256 allowance = IERC20(tokenAddress).allowance(
            msg.sender,
            address(this)
        );
        require(
            allowance >= nameCost,
            "NR: Please Approve tokens to proceed Further"
        );

        // token transfer from user to this contract
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), nameCost);

        registeredNames[name] = Names(
            msg.sender,
            tokenAddress,
            nameCost,
            block.timestamp + minLockTime,
            true
        );
        // event logging
        emit NameRegistered(
            name,
            nameCost,
            msg.sender,
            block.timestamp + minLockTime
        );

        return true;
    }

    /**
      following functions does not seems to be the part of scope
      but written to show just in case to allowed user who made registration to withdraw balance
      or admin withdraw all of the balance contract have
     */

    // this function let user withdraw tokens before registration expires
    function withdrawToken(string memory name) external {
        Names memory names = registeredNames[name];
        require(
            names.expiryTime <= block.timestamp,
            "NR: cannot unlock tokens, registration expires"
        );
        require(names.user == msg.sender, "NR: only name owner can call");
        IERC20(names.token).transfer(msg.sender, names.nameCost);
        delete registeredNames[name];
    }

    // this function let admin withdraw fee
    function withdrawToken(
        address tokenAddress,
        uint256 withdrawAmount,
        address payable walletAddress
    ) public onlyOwner {
        require(
            withdrawAmount <= IERC20(tokenAddress).balanceOf(address(this)),
            "NR: Amount Invalid"
        );
        IERC20(tokenAddress).transfer(walletAddress, withdrawAmount);
        emit WithdrawToken(tokenAddress, walletAddress, withdrawAmount);
    }

    function getNameDetail(string memory name)
        external
        view
        returns (Names memory)
    {
        return registeredNames[name];
    }
}
