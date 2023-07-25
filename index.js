import "dotenv/config";
import { Network, Alchemy, Wallet, Utils } from "alchemy-sdk";
import { ethers, parseEther } from "ethers";

const network = Network.ETH_SEPOLIA;
const networkChainID = "11155111";
var alchemyKey = process.env.ALCHEMY_API_KEY;
var mnemonic = process.env.MNEMONIC;
var publicKey = process.env.PUBLIC_KEY;
var privateKey = process.env.PRIVATE_KEY;

const mnemonicWallet = ethers.Wallet.fromPhrase(mnemonic);

const settings = {
  apiKey: alchemyKey,
  network: network,
};

const alchemy = new Alchemy(settings);
const wallet = new Wallet(privateKey);

const latestBlock = alchemy.core.getBlockNumber();

async function generateWallet() {
  const wallet = ethers.Wallet.createRandom();

  console.log("PrivateKey: " + wallet.privateKey);
  console.log("PublicKey: " + wallet.address);
  console.log("MNEMONIC: " + wallet.mnemonic.phrase);
}

async function getLatestBlock() {
  const latestBlock = await alchemy.core.getBlockNumber();
  console.log(latestBlock);
}

function convertWeiToETH(wei) {
  try {
    const weiPerEth = 1000000000000000000;
    const eth = wei / weiPerEth;
    return eth;
  } catch (error) {
    console.error("Erro ao converter saldo de wei para ETH:", error);
    return 0;
  }
}

async function getWalletBalance(address) {
  const balance = await alchemy.core.getBalance(address);
  const eth = convertWeiToETH(balance);
  console.log("Balance: " + eth);
}

async function estimateGas({
  to = "0xc5A8e79Fc97f900a59937ACdfFc9D438cfdb52cA",
  value = "1.0",
}) {
  const gas = await alchemy.core.estimateGas({
    to: to,
    value: Utils.parseEther(value),
  });
  console.log("Gas: " + gas);
  return gas;
}

async function sendTransaction({
  to = "0xc5A8e79Fc97f900a59937ACdfFc9D438cfdb52cA",
  value = "1.0",
}) {
  const gas = await estimateGas({ to, value });
  const transaction = {
    to: to,
    value: Utils.parseEther(value),
    gasLimit: gas,
    nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
    type: 2,
    chainId: networkChainID,
  };

  const rawTransaction = await wallet.signTransaction(transaction);
  const tx = await alchemy.transact.sendTransaction(rawTransaction);
  console.log(tx);
}

// getWalletBalance(publicKey);
sendTransaction({
  to: "0xc5A8e79Fc97f900a59937ACdfFc9D438cfdb52cA",
  value: "1.0",
});
