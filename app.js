// https://blog.devvivek.tech/build-your-first-web-30-application-with-html-css-javascript-and-remix-ide
const CONTRACT_ADDRESS = "0x296EADeA7A8Ff8CcF7a0292D6856607DA9718bdf";
const TESTNET = "https://rpc2.sepolia.org";
const ABI = [
  {
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "wallet",
				"type": "string"
			}
		],
		"name": "unwrap",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

//import { ethers } from "/lib/ethers-5.2.esm.min.js";
const provider = new ethers.providers.Web3Provider(window.ethereum);
let account = "0x";

async function connectWallet() {
  let accountList = await provider.send("eth_requestAccounts", []);
  account = accountList[0];
  document.getElementById("caccount").innerHTML =
    "Current Account is: " + account;
  getTokenByWallet(account);
}

function getContract() {
  let signer = provider.getSigner(account);
  let contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  return contract;
}

async function balanceOf(account) {
  let balance = await contract.balanceOf(account);
  let symbol = await contract.symbol;
  let name = await contract.name;
  document.getElementById("cbalance").innerHTML =
    "Current Balance of " + name + ": " + balance + " " + symbol;
}

async function totalSupply {
  let total = await contract.totalSupply;
  document.getElementById("ctotal").innerHTML =
    "Total Supply of " + name + ": " + totalSupply + " " + symbol;
}

async function unwrap() {
  let wallet = document.getElementById("wallet");
  let amount = document.getElementById("amount");
  if (wallet.value === "") {
    wallet.style.border = "2px solid red";
    wallet.setAttribute("placeholder", "Wallet can not be blank");
    return;
  }
  if (wallet.amount === "") {
    amount.style.border = "2px solid red";
    amount.setAttribute("placeholder", "Amount can not be blank");
    return;
  }
  
  let contract = getContract();
  let txn = await contract.unwrap(amount.value, wallet.value);
  let showhash = document.getElementById("txnhash");
  let a = document.createElement("a");
  a.href = `https://sepolia.etherscan.io/tx/${txn.hash}`;
  a.innerHTML = "Follow your transaction here";
  showhash.append(a);
  await txn.wait();
  history.go(0);
}

//window.addEventListener("load", connectWallet);
