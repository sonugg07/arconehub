// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title StandardERC20
 * @dev Safe Standardized ERC-20 token implementation for Arc Testnet (Chain ID 5042002).
 */
contract StandardERC20 {
    string public name;
    string public symbol;
    uint8 public immutable decimals;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply,
        address _owner
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _initialSupply * (10 ** uint256(_decimals));
        balanceOf[_owner] = totalSupply;
        emit Transfer(address(0), _owner, totalSupply);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        require(to != address(0), "INVALID_RECIPIENT");
        require(balanceOf[msg.sender] >= value, "INSUFFICIENT_BALANCE");

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        require(spender != address(0), "INVALID_SPENDER");
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        require(to != address(0), "INVALID_RECIPIENT");
        require(balanceOf[from] >= value, "INSUFFICIENT_BALANCE");
        require(allowance[from][msg.sender] >= value, "INSUFFICIENT_ALLOWANCE");

        allowance[from][msg.sender] -= value;
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }

    receive() external payable {}
    fallback() external payable {}
}

/**
 * @title ArcOneTokenFactory
 * @dev Standardized Token Factory for deploying ERC-20 tokens on Arc Testnet.
 */
contract ArcOneTokenFactory {
    event TokenDeployed(
        address indexed tokenAddress,
        string name,
        string symbol,
        uint256 initialSupply,
        address indexed creator
    );

    function deployToken(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply
    ) external returns (address) {
        StandardERC20 token = new StandardERC20(
            _name,
            _symbol,
            _decimals,
            _initialSupply,
            msg.sender
        );

        emit TokenDeployed(
            address(token),
            _name,
            _symbol,
            _initialSupply,
            msg.sender
        );

        return address(token);
    }
}
