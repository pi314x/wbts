// https://blog.devvivek.tech/build-your-first-web-30-application-with-html-css-javascript-and-remix-ide
// https://github.com/bitshares/bitsharesjs/issues/19
// https://github.com/BTS-CM/airdrop_tool/blob/main/src/pages/Fetch.jsx


const CONTRACTS = {
  "test": {
    "bnbt": "0x558d198723a52691EAeaD4EfEA96761f0801cfcB"
  },
  "prod": {
    "bnb": ""
  }
}

const TEST = new Boolean(true);
const NODE_MAIN = "wss://eu.nodes.bitshares.ws";
const NODE_TEST = "wss://eu.nodes.testnet.bitshares.ws"; //"wss://testnet.xbts.io/ws";
const BTSDOMAIN_MAIN = "https://bts.exchange";
const BTSDOMAIN_TEST = "https://test.xbts.io";
const CUSTODIAN = "1.2.26657";
const hexToDecimal = (hex) => parseInt(hex, 16);
const decToHeximal = (dec) => dec.toString(16);
const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider());
const emojis = {true: "✅", false: "❌"};

var account = "0xB75cCf9ddE9825C31cd02c970Ae8Aa5AD6164559";
var global = this; // in global scope.
var obj;
var ticker;
var balances;
var fObj;
var switchChainId;
var switchExplorer;
var switchContract;
var networkTxt;
var networkName;

const SUPABASE_URL = 'https://ceuszdcbuxcpbtungcam.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldXN6ZGNidXhjcGJ0dW5nY2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYwNjYzOTcsImV4cCI6MjAwMTY0MjM5N30.iQe7_E0MEyfUPjsCuJo8uOY0kYJv66UU18p29zTWkgQ'
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

document.getElementById("maintenance").innerHTML = "IN DEVELOPMENT, DO NOT USE ON MAINNET!";

const ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "wallet",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
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

function openTab(evt, tabName, color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
      tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    /*evt.style.backgroundColor = color;*/
  
    if (tabName == 'PoR') {
      totalSupply();
      BitShares().then();
    }
  
    if (tabName == 'Unwrap') {
      balanceOf(account).then();
    }
  
    if (tabName == 'Wrap') {
      BitShares().then();
    }
  
    if (tabName == 'Service') {
      ServiceData().then();
    }

  }

  $(function() {
    var networkValue = localStorage.getItem("networkValue");
    if(networkValue != null) {
      $("select[name=network]").val(networkValue);
    } 
    $("select[name=network]").on("change", function() {
      localStorage.setItem("networkValue", $(this).val());
      const networkValueIndex = networkValue.selectedIndex;
      location.reload(); 
      //global.networkValue = localStorage.getItem("networkValue");
      /*BitShares().then()
      chainList(networkValue).then()
      eth().then()
      totalSupply().then()
      ContractAddress()*/
    });
  })
  
  document.getElementById("defaultOpen").click();

if (TEST == true) {
  var node = NODE_TEST;
  var btsDomain = BTSDOMAIN_TEST;
  var tokenContracts = CONTRACTS['test']
} else {
  var node = NODE_MAIN;
  var btsDomain = BTSDOMAIN_MAIN;
  var tokenContracts = CONTRACTS['main']
}

async function chainList(short = null, chain = null) {
  try {
    //let url = 'https://chainid.network/chains.json';
    let url = 'include/chains.json';
    var json = await (await fetch(url)).json();
    //return cobj;
  } catch (error) {
    console.log("chainList()\n" + error.message);
    $.getJSON("include/chains.json", function(obj) {
      console.log(obj);
      var json = obj;
      //return obj;
    });
  } finally {
    if (short != null) {
      json = json.filter(({shortName}) => shortName === short);
    }
    if (chain != null) {
      json = json.filter(({chainId}) => chainId === chain);
      return json[0];
    }
    var chaindata = json[0];
    try { global.switchChainId = chaindata['chainId'] } catch (e) { global.switchChainId = -1 }
    try { global.switchExplorer = chaindata['explorers'][0]['url'] } catch (e) { global.switchExplorer = "" }
    try { global.switchContract = tokenContracts[networkValue] } catch (e) { global.switchContract = "" }
    try { global.networkTxt = chaindata['title'] } catch (e) { global.networkTxt = "" }
    try { global.networkName = chaindata['name'] } catch (e) { global.networkName = "" }
    try { document.getElementById("wrappertext").innerHTML = "Wrap BTS and unwrap wBTS between BitShares and " + (networkTxt !== undefined ? networkTxt : networkName) + "."; } catch(e) { console.log(e); }
    return json;
  }
}

async function metamaskData(chainId = null) {
   var j = await chainList(short = null, chain = chainId);
   try { 
     var explorer = j['explorers'][0]['url'] 
     return [{ chainId: Web3.utils.toHex(chainId),
               chainName: j['name'],
               rpcUrls: j['rpc'],
               nativeCurrency: {
                 name: j['nativeCurrency']['name'], 
                 symbol: j['nativeCurrency']['symbol'],
                 decimals: j['nativeCurrency']['decimals'],
                 },
               blockExplorerUrls: [explorer]
             }]
   } catch(e) { 
     var explorer = null
     return [{ chainId: Web3.utils.toHex(chainId),
               chainName: j['name'],
               rpcUrls: j['rpc'],
               nativeCurrency: {
                 name: j['nativeCurrency']['name'], 
                 symbol: j['nativeCurrency']['symbol'],
                 decimals: j['nativeCurrency']['decimals'],
                 }
             }]
   };  
}

async function eth() {
  try {
  window.ethereum
    ? ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          // Log public address of user((
          console.log(accounts[0]);
          // Get network ID
          let n = ethereum.chainId; // 0x1 Ethereum, 0x2 testnet, 0x89 Polygon, etc.
          console.log(n);
        })
        .catch((err) => console.log(err))
    : console.log("Please install MetaMask");

  if (window.ethereum !== undefined) {
    //var provider = new ethers.providers.Web3Provider(window.ethereum);
    var network = await provider.getNetwork();
    var networkName = network["name"];
    var chainIdHex = network["chainId"];
    var chainIdDec = hexToDecimal(chainIdHex);
    try {
      switchChainIdHex = Web3.utils.toHex(switchChainId);
    } catch (error) {
      switchChainIdHex = "0x61"; // prod 0x38
    }     
    
    console.log(switchChainIdHex);
    
    try {
      const res = await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: switchChainIdHex }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            id: 1,
            jsonrpc: "2.0",
            method: "wallet_addEthereumChain",
            params: await metamaskData(chainid = hexToDecimal(switchChainIdHex)),
          });
        } catch (addError) {
        }
      }
    } 
  } else {
    console.log("Please install MetaMask");
    document.getElementById("installmetamask").innerHTML = "";
    let showmetamaskinfo = document.getElementById("installmetamask");
    let a = document.createElement("a");
    a.href = `https://metamask.io/`;
    a.innerHTML = "MetaMask";
    a.setAttribute("target", "_blank");
    showmetamaskinfo.append("For the full experience, \nplease install ");
    showmetamaskinfo.append(a);
    showmetamaskinfo.append("!");
  };
  
  ethereum.on('chainChanged', () => {
  document.location.reload()
})
  
} catch (error) {
  console.log('window.ethereum()\n' + error.message);
}
}

async function connectWallet() {
  await eth();
  var prev_account = account;
  let accountList = await provider.send("eth_requestAccounts", []);
  account = await toChecksumAddress(accountList[0]);
  document.getElementById("caccount").innerHTML = "Active account: " + account;
  document.getElementById("caccount").innerHTML = "";
  let caccount = document.getElementById("caccount");
  let a = document.createElement("a");
  a.href = `${switchExplorer}/address/${account}`;
  a.innerHTML = account;
  a.setAttribute("target", "_blank");
  a.setAttribute("class", "header");
  caccount.append("Active account: ");
  caccount.append(a);
  await balanceOf(account);
  if (prev_account != account) {
    document.getElementById("txnhash").innerHTML = "";
  }
document.getElementById("connectWallet").innerHTML = "Connected";
  await BitShares();
}

function ContractAddress() {
  document.getElementById("contractaddr").innerHTML = "";
  let contractaddr = document.getElementById("contractaddr");
  let a = document.createElement("a");
  a.href = `${switchExplorer}/token/${switchContract}`;
  a.innerHTML = switchContract;
  a.setAttribute("target", "_blank");
  contractaddr.append("Contract address:\n\n");
  contractaddr.append(a);
}

function getContract() {
  console.log(global.switchContract);
  let signer = provider.getSigner(account);
  let contract = new ethers.Contract(switchContract, ABI, signer);
  return contract;
}

async function toChecksumAddress(address) {
  let checkSumAddress = await ethers.utils.getAddress(address);
  return checkSumAddress;
}
function useFullBalance(amount) {
  document.getElementById("amount").value=""
  document.getElementById("amount").value=amount
}

async function balanceOfArray(account) {
  let contract = getContract();
  let balance = await contract.balanceOf(account);
  let symbol = await contract.symbol();
  let name = await contract.name();
  let decimals = await contract.decimals();
  balance = balance / Math.pow(10, decimals)
  return [name, symbol, balance];
}

async function balanceOf(account) {
  let bArr = await balanceOfArray(account);
  let name = bArr[0];
  let symbol = bArr[1];
  let balance = bArr[2];
  document.getElementById("cbalance").innerHTML =
    "Current Balance of " + name + ": <b>" + "<a href = \"#\" onclick = \"useFullBalance(" + balance + ")\">" + balance + "</a>" + " " + symbol + "</b>";
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

async function BitShares(method = null, params = null) {

  async function fetchObjects(method, params) {
    return new Promise(async (resolve, reject) => {
      console.log("Fetching objects");
      try {
        await bitshares_js.bitshares_ws.Apis.instance(node, true).init_promise;
      } catch (error) {
        console.log(error);
        document.getElementById("custname").innerHTML =
          "There might be a problem connecting the node: " + node;
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
            break;
          case method:
            object = await bitshares_js.bitshares_ws.Apis.instance()
              .db_api()
              .exec(method, params);
            break;
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

  try {
    
    if (method == null & params == null) {

      obj = await fetchObjects("get_objects", ["1.3.0", CUSTODIAN]);
      ticker = await fetchObjects("get_ticker", ["1.3.0", "1.3.22"]);
      balances = await fetchObjects("get_account_balances", [CUSTODIAN, ["1.3.0"]]);

      var total = Number(balances[0]["amount"]);
      let symbol = obj[0]["symbol"];
      let decimals = obj[0]["precision"];
      let custName = obj[1]["name"];
      let fees = Number(ticker["highest_bid"]).toFixed(0);
      let minimum = Number(fees) + 2;
      var total = total / Math.pow(10, decimals);
      
      document.getElementById("custname").innerHTML =
        "Send your desired amount of BTS to the BitShares account <span id = \"custAccount\" class = \"custAccount-css\" >" + custName + "</span>" + 
        "<a href =\"#\" onclick = \"CopyToClipboard(\'custAccount\');return false;\"><img src=\"img/clipboard.svg\" data-img-src=\"img/checkbox_checked.svg\" class=\"responsive\" id=\"clipboard-custAccount\" style=\"background-color: #ccc;\"></img></a>" +
        "</b> and add the network and ERC20 address separated by a colon into the memo field where you want to receive your wrapped BitShares as shown in the screenshot in the example of the Binance Smart Chain." 
      document.getElementById("memo").innerHTML = "";
      document.getElementById("memo").innerHTML = "Please connect your EVM compatible wallet using MetaMask to get the appropiate format.";
      if (account != "0xB75cCf9ddE9825C31cd02c970Ae8Aa5AD6164559") {
        document.getElementById("memo").innerHTML = "";
        document.getElementById("memo").innerHTML =
          "If the connected wallet and blockchain are the ones you want to use, feel free to select the clipboard symbol to have the memo ready once you need it."
        document.getElementById("memoformat").innerHTML = "";
        var copyaddr = document.getElementById("memoformat");
        var a = document.createElement("a");
        a.href = `#`;
        a.innerHTML = `<img src="img/clipboard.svg" data-img-src="img/checkbox_checked.svg" class="responsive" id="clipboard-memoformat" style="background-color: #ccc;"></img>`;
        a.setAttribute("onclick", "CopyToClipboard('memoformat');return false;");
        copyaddr.append(networkValue + ":" + account);
        copyaddr.append(a);
      }
      document.getElementById("bts-screenshot").innerHTML = ""
      document.getElementById("bts-screenshot").innerHTML = "<img src = 'img/send_bts.png' class = 'img-fluid' style = 'border-radius: 8px; max-width: 100%;' title = 'Screenshot of https://bts.exchange/' />"
      document.getElementById("fees").innerHTML =
        "Please be aware that a minimum of " +
        fees +
        " BTS or " + (100/fees).toFixed(3) + " % will be deducted as gateway fee which leads to a wrap amount of at least " +
        minimum +
        " BTS. An amount below will not be credited.";

      document.getElementById("ccust").innerHTML = "";
      var showcust = document.getElementById("ccust");
      var a = document.createElement("a");
      a.href = `${btsDomain}/#/account/${custName}`;
      a.innerHTML = custName;
      a.setAttribute("target", "_blank");
      showcust.append("Custodian account: ")
      showcust.append(a);

      document.getElementById("cbalcust").innerHTML =
        "Custodian reserves: " + total + " " + symbol;

    } else { 
      
      fObj = await fetchObjects(method, [params]);
      
    }
    
  } catch (error) {
    console.log('BitShares()\n' + error.message);
    document.getElementById("custname").innerHTML =
      "There might be a problem connecting the node: " + node;
  }
}

async function unwrap() {
  let wallet = document.getElementById("wallet");
  let amount = document.getElementById("amount");
  document.getElementById("invalidAccount").innerHTML = "";
  document.getElementById("invalidAmount").innerHTML = "";
  if (wallet.value != "") {
    await BitShares("get_accounts", [wallet.value]);
    if (global.fObj[0] == null) {
      document.getElementById("invalidAccount").innerHTML = "BitShares account doesn't exists.";
      return;
    }
  }
  if (wallet.value === "") {
    document.getElementById("invalidAccount").innerHTML = "BitShares account mustn't be empty.";
    return;
  }
  if (isNaN(amount.value)) {
    document.getElementById("invalidAmount").innerHTML = "Amount isn't a number.";
    return;
  }
  if (amount.value == null || amount.value === "") {
    document.getElementById("invalidAmount").innerHTML = "Amount mustn't be empty.";
    return;
  }
  if (amount.value <= 0) {
    document.getElementById("invalidAmount").innerHTML = "Amount must be positive.";
    return;
  }
  if (amount.value <= 1) {
    document.getElementById("invalidAmount").innerHTML = "Amount too low.";
    return;
  }
  if (amount.value > (await balanceOfArray(account))[2]) {
    document.getElementById("invalidAmount").innerHTML = "Amount exceeds your balance.";
    return;
  }
  let contract = getContract();
  let decimals = await contract.decimals();
  let unwrapAmount = amount.value * Math.pow(10, decimals);
  let txn = await contract.unwrap(wallet.value, unwrapAmount);
  let showhash = document.getElementById("txnhash");
  let a = document.createElement("a");
  a.href = `${switchExplorer}/tx/${txn.hash}`;
  a.innerHTML = "Open transaction<br>";
  a.setAttribute("target", "_blank");
  showhash.append(a);
  await txn.wait();
  //history.go(0);
}

var networkValue = localStorage.getItem("networkValue");
if(networkValue != null) {
    $("select[name=network]").val(networkValue);
} else {
  networkValue = "bnbt";
}

function CopyToClipboard(id) {
  var r = document.createRange();
  r.selectNode(document.getElementById(id));
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(r);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  clicked(id);
}

function clicked(id) {
  replace(id);
  setTimeout(function () {
      replace(id)
  }, 1500);

}

function replace(id) {
  var el = "clipboard-" + id;
  var next = document.getElementById(el).getAttribute("data-img-src");
  var current = document.getElementById(el).src;

  document.getElementById(el).setAttribute("data-img-src", current);
  document.getElementById(el).src = next;
}
  
function darkMode() {
   var element = document.body;
   element.classList.toggle("inverse");
}

async function main() {
  await Networks();
  await ServiceData();
  await BitShares();
  await chainList(short = networkValue, chain = null);
  await eth();
  await totalSupply();
  ContractAddress();

}

async function isWrapperRunning() {
  
    var running;
    
    const { data, error } = await _supabase
        .from('wrapper_status')
        .select()
    
    console.log(data)
  
    if (!error) {
      data.forEach(function(item, index){
        if (index == 0) {
          running = item.running
          console.log(running)
        }
      })
    }
    
    return running;
}

//https://onebite.dev/play-with-supabase-database-in-website-with-javascript/
async function ServiceData() {
  
    const isRunning = await isWrapperRunning()
  
    const { data, error } = await _supabase
            .from('unwrapper_status')
            .select()
            .order('name', { ascending: true })
    
    console.log(data)
    console.log(error)
  
    if(!error) {
      
        document.getElementById('service').innerHTML = "";
        const parent = document.getElementById('service')

        let contents = ''
        contents += `<div>Please find below the system status of the wrapper & unwrapper services:</div><p></p>` 
        data.forEach(function(item){
            contents += `<div>${emojis[(isRunning * item.running == 1 ? true : false)]} ${item.name} (${item.short_name})</div>` 
        })
        
        parent.insertAdjacentHTML('beforeend', contents)
    }
}

async function Networks() {
  const networksDropDown = document.getElementById("networksDropDown");
  //const ni = networksDropDown.options[networksDropDown.options.selectedIndex].selected = true;
  const networksData = {
    "bnbt": "BNB Smart Chain Testnet"
  }

  for (let key in networksData) {
    let option = document.createElement("option");
    option.setAttribute('value', key);
    option.innerHTML = networksData[key];
    try {
      const { data, error } = await _supabase
              .from('unwrapper_status')
              .select()
              .eq('short_name', key)
              .eq('running', false);
      if(!error & data.length == 1) {
        option.setAttribute('disabled', ''); 
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
    if (key == networkValue) {
      option.setAttribute("selected", "selected");
    }
    
    /*let optionText = document.createTextNode(key);
    /*option.appendChild(optionText);*/
    networksDropDown.appendChild(option);
  }
}

window.addEventListener("load", main);
