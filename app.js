// https://blog.devvivek.tech/build-your-first-web-30-application-with-html-css-javascript-and-remix-ide
// https://github.com/bitshares/bitsharesjs/issues/19
// https://github.com/BTS-CM/airdrop_tool/blob/main/src/pages/Fetch.jsx

const CONTRACT_ADDRESS = "0x296EADeA7A8Ff8CcF7a0292D6856607DA9718bdf";
const CHAINID_ETHEREUM = 1;
const CHAINID_SEPOLIA = 11155111;
const CHAINID_BSC_MAIN = 56;
const CHAINID_BSC_TEST = 97;
const CHAINID_EOSEVM_MAIN = 17777;
const CHAINID_EOSEVM_TEST = 15557;
const TEST = new Boolean(true);
const NODE_MAIN = "wss://eu.nodes.bitshares.ws";
const NODE_TEST = "wss://testnet.xbts.io/ws";
const CUSTODIAN = "1.2.26653";
const hexToDecimal = (hex) => parseInt(hex, 16);
const decToHeximal = (dec) => dec.toString(16);
var account = "0xaFF9578C3c7DFD634926c5Bc8c5e0E7EFf98fD95";
const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io/"
const BSC_EXPLORER = "https://testnet.bscscan.com/"
const EOSEVM_EXPLORER = "https://explorer.testnet.evm.eosnetwork.com/"

const ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "wallet",
        type: "string",
      },
    ],
    name: "unwrap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

if (TEST == true) {
  var node = NODE_TEST;
} else {
  var node = NODE_MAIN;
}

async function connectWallet() {
  var prev_account = account;
  let accountList = await provider.send("eth_requestAccounts", []);
  account = await toChecksumAddress(accountList[0]);
  document.getElementById("caccount").innerHTML =
    "Active account: " + account;
  await balanceOf(account);
  if (prev_account != account) {
    document.getElementById("txnhash").innerHTML = "";
  }
  await BitShares();
}

function ContractAddress() {
  /*document.getElementById("contractaddr").innerHTML = "Contract address: " + CONTRACT_ADDRESS;*/
  let contractaddr = document.getElementById("contractaddr");
  let a = document.createElement("a");
  a.href = `${switchExplorer}token/${CONTRACT_ADDRESS}`;
  a.innerHTML = CONTRACT_ADDRESS;
  a.setAttribute("target", "_blank");
  contractaddr.append(a);
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
  const val = document.querySelector("input").balance;
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
}

var obj;
var ticker;
var balances;

async function fetchObjects(method, params) {
  return new Promise(async (resolve, reject) => {
    console.log("Fetching objects");
    try {
      await bitshares_js.bitshares_ws.Apis.instance(node, true).init_promise;
    } catch (error) {
      console.log(error);
      changeURL(value);
      return reject({
        error,
        location: "init",
        node: node,
      });
    }

    let object;
    try {
      switch (method) {
        case "get_objects":
          object = await bitshares_js.bitshares_ws.Apis.instance()
            .db_api()
            .exec("get_objects", [params]);
          break;
        case "get_ticker":
          object = await bitshares_js.bitshares_ws.Apis.instance()
            .db_api()
            .exec("get_ticker", params);
          break;
        case "get_account_balances":
          object = await bitshares_js.bitshares_ws.Apis.instance()
            .db_api()
            .exec("get_account_balances", params);
        default:
          console.log("method not supplied yet.");
      }
    } catch (error) {
      console.log(error);
      return reject({
        error,
        location: "exec",
        node: node,
      });
    }
    return resolve(object);
  });
}

async function BitShares() {
  obj = await fetchObjects("get_objects", ["1.3.0", CUSTODIAN]);
  ticker = await fetchObjects("get_ticker", ["1.3.0", "1.3.22"]);
  balances = await fetchObjects("get_account_balances", [CUSTODIAN, ["1.3.0"]]);

  var total = Number(balances[0]["amount"]);
  let symbol = obj[0]["symbol"];
  let decimals = obj[0]["precision"];
  let custName = obj[1]["name"];
  let fees = Number(ticker["highest_bid"]).toFixed(0);
  let minimum = Number(fees) + 1;
  var total = total / Math.pow(10, decimals);

  document.getElementById("custname").innerHTML =
    "Send token to wallet address <b>" +
    custName +
    "</b> and add the network and ERC20 address separated by a colon into the memo field where you want to receive the wrapped tokens. Connect wallet for more.";
  if (account != "0xaFF9578C3c7DFD634926c5Bc8c5e0E7EFf98fD95") {
    document.getElementById("memo").innerHTML =
      "If you are using the connected wallet, your memo must look like this:"
    document.getElementById("memoformat").innerHTML =
      networkValue + ":" + account;
  }
  document.getElementById("fees").innerHTML =
    "Please be aware that " +
    fees +
    " token which equals approximately 1 USDT will be deducted as a gateway fee.";
  document.getElementById("minimum").innerHTML =
    "Minimum wrap amount: " +
    minimum +
    " token.";
  
  document.getElementById("ccust").innerHTML = "";
  var showcust = document.getElementById("ccust");
  var a = document.createElement("a");
  a.href = `https://wallet.bitshares.org/#/account/${custName}`;
  a.innerHTML = custName;
  a.setAttribute("target", "_blank");
  showcust.append("Custodian Wallet: ")
  showcust.append(a);

  document.getElementById("cbalcust").innerHTML =
    "Custodian Treasury amount: " + total + " " + symbol;
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
  if (amount.value == 1) {
    amount.style.border = "2px solid red";
    amount.setAttribute("placeholder", "Amount too low.");
    return;
  }
  let contract = getContract();
  let decimals = await contract.decimals();
  let unwrapAmount = amount.value * Math.pow(10, decimals);
  let txn = await contract.unwrap(unwrapAmount, wallet.value);
  let showhash = document.getElementById("txnhash");
  let a = document.createElement("a");
  a.href = `${switchExplorer}tx/${txn.hash}`;
  a.innerHTML = "Open transaction<br>";
  a.setAttribute("target", "_blank");
  showhash.append(a);
  await txn.wait();
  //history.go(0);
}

window.ethereum
  ? ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        // Log public address of user
        console.log(accounts[0]);

        // Get network ID
        let n = ethereum.chainId; // 0x1 Ethereum, 0x2 testnet, 0x89 Polygon, etc.
        console.log(n);
      })
      .catch((err) => console.log(err))
  : console.log("Please install MetaMask");

if (window.ethereum !== undefined) {
  var provider = new ethers.providers.Web3Provider(window.ethereum);
  var network = provider.getNetwork();
  var networkName = network["name"];
  var chainIdHex = network["chainId"];
  var chainIdDec = hexToDecimal(chainIdHex);
  /*console.log(chainIdHex);
  console.log(chainIdDec);*/
  
  try {
    ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia",
              rpcUrls: ["https://rpc2.sepolia.org"],
              nativeCurrency: {
                name: "SepoliaETH",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://sepolia.etherscan.io/"],
            },
          ],
        });
      } catch (error) {
        alert(error.message);
      }
    }
  }
} else {
  console.log("Please install MetaMask");
  let showmetamaskinfo = document.getElementById("installmetamask");
  let a = document.createElement("a");
  a.href = `https://metamask.io/`;
  a.innerHTML = "MetaMask";
  a.setAttribute("target", "_blank");
  showmetamaskinfo.append("For the full experience, \nplease install ");
  showmetamaskinfo.append(a);
  showmetamaskinfo.append("!");
};

var networkValue = localStorage.getItem("networkValue");
if(networkValue != null) {
    $("select[name=network]").val(networkValue);
} else {
  networkValue = "sepolia";
}

switch (networkValue)
{
  case "sepolia":
    var switchChainId = CHAINID_SEPOLIA
    var switchExplorer = SEPOLIA_EXPLORER
    var networkTxt = "Sepolia"
  break;
  case "eos":
    var switchChainId = CHAINID_EOSEVM_TEST
    var switchExplorer = EOSEVM_EXPLORER
    var networkTxt = "EOS"
  break;
  case "bsc":
    var switchChainId = CHAINID_BSC_TEST
    var switchExplorer = BSC_EXPLORER
    var networkTxt = "Binance Smart Chain"
  break;
  default:
    var switchChainId = CHAINID_SEPOLIA
    var switchExplorer = SEPOLIA_EXPLORER
    var networkTxt = "Sepolia"
}

function copyToClipboard() {
  var copyText = document.getElementById("memoformat").value;
  navigator.clipboard.writeText(copyText).then(() => {
      // Alert the user that the action took place.
      // Nobody likes hidden stuff being done under the hood!
      // alert("Copied to clipboard");
  });
}

document.getElementById("wrappertext").innerHTML = "Wrap and unwrap token between blockchain and " + networkTxt + ".";

async function main() {
  await BitShares();
  await totalSupply();
  ContractAddress();
}

window.addEventListener("load", main);
