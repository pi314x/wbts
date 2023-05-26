// https://blog.devvivek.tech/build-your-first-web-30-application-with-html-css-javascript-and-remix-ide
const CONTRACT_ADDRESS = "0x296EADeA7A8Ff8CcF7a0292D6856607DA9718bdf";
const CHAINID_SEPOLIA = 11155111;
const CHAINID_BSC = 61;
const BTS_TEST = true;

// https://github.com/bitshares/bitsharesjs


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
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
];

//import { ethers } from "/lib/ethers-5.2.esm.min.js";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const network = provider.getNetwork()
const networkName = network['name'];
const chainId = network['chainId'];
let account = "0xaFF9578C3c7DFD634926c5Bc8c5e0E7EFf98fD95";

async function connectWallet() {
  let accountList = await provider.send("eth_requestAccounts", []);
  account = await toChecksumAddress(accountList[0]);
  document.getElementById("caccount").innerHTML = "Current Account is: " + account;
  await balanceOf(account);
}

function ContractAddress() {
  document.getElementById("contractaddr").innerHTML = CONTRACT_ADDRESS;
  /*let contractaddr = document.getElementById("contractaddr");
  let a = document.createElement("a");
  a.href = `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`;
  a.innerHTML = CONTRACT_ADDRESS
  contractaddr.append(a);*/
}

function getContract() {
  let signer = provider.getSigner(account);
  let contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  return contract;
}

function BitShares() {
	if (BTS_TEST == true) {
		let node = "wss://test.xbts.io"
	} else {
		let node = "wss://eu.nodes.bitshares.ws"
	}
	x = bitshares_js.bitshares_ws.Apis.instance(node).init_promise.then(res => {
    console.log("connected to:", res[0].network);
	});
	return x;
}

async function toChecksumAddress(address) {
  let checkSumAddress = await ethers.utils.getAddress(address);
  return checkSumAddress;
}

async function balanceOf(account) {
  let contract = getContract();
  let balance = await contract.balanceOf(account);
  let symbol = await contract.symbol();
  let name = await contract.name();
  let decimals = await contract.decimals();
  balance = balance / Math.pow(10, decimals);
  document.getElementById("cbalance").innerHTML =
    "Current Balance of " + name + ": " + balance + " " + symbol;
}

async function balanceOfSlider(account) {
  let contract = getContract();
  let balance = await contract.balanceOf(account);
  let symbol = await contract.symbol();
  let name = await contract.name();
  let decimals = await contract.decimals();
  balance = balance / Math.pow(10, decimals);
  const val = document.querySelector('input').balance;
  console.log(val);
}

async function totalSupply() {
  let contract = getContract();
  let total = await contract.totalSupply();
  let symbol = await contract.symbol();
  let name = await contract.name();
  let decimals = await contract.decimals();
  total = total / Math.pow(10, decimals);
  document.getElementById("ctotal").innerHTML =
    "Total Supply of " + name + ": " + total + " " + symbol;
  await ContractAddress();
  //await totalBalanceCustodian;
}

async function totalBalanceCustodian() {
  let bts = BitShares();
	let balances = await bitshares_js.bitshares_ws.Apis.db.get_account_balances("1.2.25961",["1.3.0"])
	let ticker = await bitshares_js.bitshares_ws.Apis.db.get_ticker('1.3.0','1.3.5589')
	let obj = await bitshares_js.bitshares_ws.Apis.db.get_object('1.3.0')
  let total = 0;//await contract.totalSupply();
  let symbol = 'T';//await contract.symbol();
  let name = 'Token';//await contract.name();
  let decimals = 5;//await contract.name();
  total = total / Math.pow(10, decimals);
  document.getElementById("cbalcust").innerHTML =
    "Total Supply of " + name + ": " + total + " " + symbol;
}

async function unwrap() {
  let wallet = document.getElementById("wallet");
  let amount = document.getElementById("amount");
  if (wallet.value === "") {
    wallet.style.border = "2px solid red";
    wallet.setAttribute("placeholder", "Wallet mustn't be empty.");
    return;
  }
  if (amount.value == null || amount.value === "") {
    amount.style.border = "2px solid red";
    amount.setAttribute("placeholder", "Amount mustn't be empty.");
    return;
  }
  if (amount.value < 0) {
    amount.style.border = "2px solid red";
    amount.setAttribute("placeholder", "Amount must be positive.");
    return;
  }
  let contract = getContract();
  let decimals = await contract.decimals();
  let unwrapAmount = amount.value * Math.pow(10, decimals);
  let txn = await contract.unwrap(unwrapAmount, wallet.value);
  let showhash = document.getElementById("txnhash");
  let a = document.createElement("a");
  a.href = `https://sepolia.etherscan.io/tx/${txn.hash}`;
  a.innerHTML = txn.hash;
  a.setAttribute('target', '_blank');
  showhash.append(a);
  await txn.wait();
  //history.go(0);
}

window.addEventListener("load", totalSupply);
