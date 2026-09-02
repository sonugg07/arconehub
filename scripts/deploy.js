const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const solc = require('solc');

async function main() {
  const rpcUrl = process.env.ARC_TESTNET_RPC_URL || 'https://rpc.testnet.arc.network';
  const privateKey = process.env.PRIVATE_KEY;

  console.log('--- ArcOne Hub Contract Deployer ---');
  console.log(`Target RPC: ${rpcUrl}`);

  // Read contracts
  const escrowSource = fs.readFileSync(path.join(__dirname, '../contracts/ArcOneEscrow.sol'), 'utf8');
  const factorySource = fs.readFileSync(path.join(__dirname, '../contracts/ArcOneTokenFactory.sol'), 'utf8');

  // Compile Escrow
  const inputEscrow = {
    language: 'Solidity',
    sources: { 'ArcOneEscrow.sol': { content: escrowSource } },
    settings: {
      outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } },
      optimizer: { enabled: true, runs: 200 }
    }
  };
  const outputEscrow = JSON.parse(solc.compile(JSON.stringify(inputEscrow)));
  const escrowArtifact = outputEscrow.contracts['ArcOneEscrow.sol']['ArcOneEscrow'];

  // Compile Factory
  const inputFactory = {
    language: 'Solidity',
    sources: { 'ArcOneTokenFactory.sol': { content: factorySource } },
    settings: {
      outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } },
      optimizer: { enabled: true, runs: 200 }
    }
  };
  const outputFactory = JSON.parse(solc.compile(JSON.stringify(inputFactory)));
  const factoryArtifact = outputFactory.contracts['ArcOneTokenFactory.sol']['ArcOneTokenFactory'];
  const erc20Artifact = outputFactory.contracts['ArcOneTokenFactory.sol']['StandardERC20'];

  // Save compiled artifacts to src/contracts
  const outDir = path.join(__dirname, '../src/contracts');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(path.join(outDir, 'ArcOneEscrow.json'), JSON.stringify({ abi: escrowArtifact.abi, bytecode: escrowArtifact.evm.bytecode.object }, null, 2));
  fs.writeFileSync(path.join(outDir, 'ArcOneTokenFactory.json'), JSON.stringify({ abi: factoryArtifact.abi, bytecode: factoryArtifact.evm.bytecode.object }, null, 2));
  console.log('✓ Compiled ArcOneEscrow and ArcOneTokenFactory artifacts.');

  if (!privateKey) {
    console.log('\n[NOTE] No PRIVATE_KEY environment variable provided.');
    console.log('To deploy to Arc Testnet, run:');
    console.log('  $env:PRIVATE_KEY="0xYourPrivateKey"; node scripts/deploy.js');
    return;
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`Deploying from account: ${wallet.address}`);

  const balance = await provider.getBalance(wallet.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} USDC`);

  // Deploy Factory
  console.log('\nDeploying ArcOneTokenFactory...');
  const FactoryContract = new ethers.ContractFactory(factoryArtifact.abi, factoryArtifact.evm.bytecode.object, wallet);
  const factory = await FactoryContract.deploy({ gasLimit: 2000000 });
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log(`✓ ArcOneTokenFactory deployed to: ${factoryAddress}`);

  // Deploy Escrow
  console.log('\nDeploying ArcOneEscrow...');
  const EscrowContract = new ethers.ContractFactory(escrowArtifact.abi, escrowArtifact.evm.bytecode.object, wallet);
  const escrow = await EscrowContract.deploy({ gasLimit: 2000000 });
  await escrow.waitForDeployment();
  const escrowAddress = await escrow.getAddress();
  console.log(`✓ ArcOneEscrow deployed to: ${escrowAddress}`);

  console.log('\n=== Summary of Deployed Contracts ===');
  console.log(`ArcOneTokenFactory: ${factoryAddress}`);
  console.log(`ArcOneEscrow:       ${escrowAddress}`);
  console.log(`Block Explorer:     https://testnet.arcscan.app/address/${factoryAddress}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
