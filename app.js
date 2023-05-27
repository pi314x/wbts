// https://blog.devvivek.tech/build-your-first-web-30-application-with-html-css-javascript-and-remix-ide
// https://github.com/bitshares/bitsharesjs/issues/19
// https://github.com/bitshares/bitsharesjs/issues/9

const CONTRACT_ADDRESS = "0x296EADeA7A8Ff8CcF7a0292D6856607DA9718bdf";
const CHAINID_ETHEREUM = 1;
const CHAINID_SEPOLIA = 11155111;
const CHAINID_BSC_MAIN = 56;
const CHAINID_BSC_TEST = 97;
const TEST = new Boolean(true);
const NODE_MAIN = "wss://eu.nodes.bitshares.ws";
const NODE_TEST = "wss://testnet.xbts.io/ws";
const CUSTODIAN = "1.2.26650";

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

if (TEST == true) {
  var node = NODE_TEST;

} else {
  var node = NODE_MAIN;
}

window.ethereum ?
  ethereum.request({method: "eth_requestAccounts"}).then((accounts) => {
  
    // Log public address of user
    console.log(accounts[0])
  
    // Get network ID
    let n = ethereum.chainId // 0x1 Ethereum, 0x2 testnet, 0x89 Polygon, etc.
    console.log(n)
    
  }).catch((err) => console.log(err))
: console.log("Please install MetaMask")

var account = "0xaFF9578C3c7DFD634926c5Bc8c5e0E7EFf98fD95";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const network = provider.getNetwork();
const networkName = network['name'];
const chainId = network['chainId'];

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
  await BitShares();
}

var obj;
var ticker;
var balances;

async function get_objects(obj) {
    return bitshares_js.bitshares_ws.Apis.instance(node, true).db_api().exec("get_objects", [
                obj
            ]).then(dict => {
                return dict;
            }).catch(err => {
                console.log("err:", err);
    })
};

async function get_ticker(base, quote) {
    return bitshares_js.bitshares_ws.Apis.instance(node, true).db_api().exec("get_ticker", [
                base, quote
            ]).then(dict => {
                return dict;
            }).catch(err => {
                console.log("err:", err);
    })
};

async function get_account_balances(account_id, assets) {
    return bitshares_js.bitshares_ws.Apis.instance(node, true).db_api().exec("get_account_balances", [
                account_id , assets
            ]).then(dict => {
                return dict;
            }).catch(err => {
                console.log("err:", err);
    })
};

async function BitShares() {
  // https://github.com/bitshares/bitsharesjs
  bitshares_js.bitshares_ws.Apis.instance(node, true).init_promise.then((res) => {
    console.log("connected to:", res[0].network);
  });
	
//  Apis = await bitshares_js.bitshares_ws.Apis.instance(node, true).init_promise;
	var Apis = null;
export const instance = (
  cs = node,
  connect,
  connectTimeout = 4000,
  optionalApis,
  closeCb
) => {
  if (!Apis) {
    Apis = newApis();
    Apis.setRpcConnectionStatusCallback(statusCb);
  }

  if (Apis && connect) {
    Apis.connect(cs, connectTimeout, optionalApis);
  }
  if (closeCb) Apis.closeCb = closeCb;
  return Apis;
};
	Apis.connect(node);
  var obelix = await bitshares_js.bitshares_ws.Apis.instance().db_api().exec("get_objects", [['1.3.0']]);
  var asterix = await bitshares_js.bitshares_ws.Apis.instance().db_api().exec("get_ticker", ['1.3.0','1.3.22']);
  var obj = await get_objects(['1.3.0']);
  var ticker = await get_ticker('1.3.0','1.3.22');
  var balances = await get_account_balances(CUSTODIAN,["1.3.0"]);

  var total = Number(balances[0]["amount"]);
  let symbol = obj[0]['symbol'];
  let decimals = obj[0]['precision'];
  let fees = Number(ticker["highest_bid"]).toFixed(0);
  let minimum = Number(fees) + 1;
  var total = total / Math.pow(10, decimals);
	
  document.getElementById("fees").innerHTML = "Please be aware that " + fees + " token equals 1 USDT will be deducted as a gateway fee.";
  document.getElementById("minimum").innerHTML = "Minimun wrap or deposit amount to Binance Smart Chain is " + minimum + " token.";
  document.getElementById("cbalcust").innerHTML =
    "Custodian Wallet Supply: " + total + " " + symbol;

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
