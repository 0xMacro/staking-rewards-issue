pragma solidity ^0.5.16;
import "openzeppelin-solidity-2.3.0/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor () public
    {
        _mint(msg.sender, 10**27);
    }
}