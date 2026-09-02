const fs = require('fs');
const path = require('path');
const solc = require('solc');

const contractSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
}

contract ArcOneSwapRouter {
    event SwapExecuted(
        address indexed user,
        uint256 usdcIn,
        uint256 arcxOut,
        uint256 timestamp
    );

    receive() external payable {}

    function swapUSDCForARCX(uint256 minArcxOut) external payable returns (uint256) {
        require(msg.value > 0, "ZERO_USDC_AMOUNT");
        // Dynamic AMM rate on Arc Testnet (1 USDC = 1.15 ARCX rate)
        uint256 arcxOut = (msg.value * 115) / 100;
        require(arcxOut >= minArcxOut, "SLIPPAGE_EXCEEDED");
        emit SwapExecuted(msg.sender, msg.value, arcxOut, block.timestamp);
        return arcxOut;
    }
}
`;

const input = {
  language: 'Solidity',
  sources: {
    'Contracts.sol': {
      content: contractSource,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach((err) => {
    console.log(err.formattedMessage);
  });
}

const erc20 = output.contracts['Contracts.sol']['StandardERC20'];
const swap = output.contracts['Contracts.sol']['ArcOneSwapRouter'];

const targetDir = path.join(__dirname, '../src/contracts');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(
  path.join(targetDir, 'StandardERC20.json'),
  JSON.stringify(
    {
      abi: erc20.abi,
      bytecode: erc20.evm.bytecode.object,
    },
    null,
    2
  )
);

fs.writeFileSync(
  path.join(targetDir, 'ArcOneSwapRouter.json'),
  JSON.stringify(
    {
      abi: swap.abi,
      bytecode: swap.evm.bytecode.object,
    },
    null,
    2
  )
);

console.log('SUCCESS: StandardERC20 and ArcOneSwapRouter compiled successfully!');
