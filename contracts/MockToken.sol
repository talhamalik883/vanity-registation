// SPDX-License-Identifier: agpl-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

// Example class - a mock class using delivering from ERC20
contract MockToken is ERC20 {
    constructor(
        uint256 initialBalance, 
        string memory name, 
        string memory symbol 
    ) 
        ERC20(name, symbol) 
    {
        _mint(msg.sender, initialBalance);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}