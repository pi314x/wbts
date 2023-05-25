const CONTRACT_ADDRESS = "PASTE_YOUR_CONTRACT_ADDRESS_HERE";
const ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "learning",
        type: "string",
      },
    ],
    name: "addLearner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllLearners",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "card",
            type: "address",
          },
          {
            internalType: "string",
            name: "learning",
            type: "string",
          },
        ],
        internalType: "struct ChainJourney.Learner[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const provider = new ethers.providers.Web3Provider(window.ethereum);
let account = "0x";

async function connectWallet() {
  let accountList = await provider.send("eth_requestAccounts", []);
  account = accountList[0];
  document.getElementById("caccount").innerHTML =
    "Current Account is :" + account;
  getlearners();
}

function getContract() {
  let signer = provider.getSigner(account);
  let contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  return contract;
}

async function getlearners() {
  let contract = getContract();
  let learners = await contract.getAllLearners();
  // console.log(learners);
  for (const item of learners) {
    appendCard(item);
  }
}

function appendCard(item) {
  let container = document.getElementsByClassName("container")[0];
  let card = document.createElement("div");
  card.className = "card";
  card.innerHTML =
    "Address " + item.card + "<br/>" + "Learning : " + item.learning;
  container.append(card);
}

async function addLearner() {
  let learningtext = document.getElementById("inputText");
  if (learningtext.value === "") {
    learningtext.style.border = "2px solid red";
    learningtext.setAttribute("placeholder", "This filed can not be blank");
    return;
  }
  let contract = getContract();
  let txn = await contract.addLearner(learningtext.value);
  let showhash = document.getElementById("txnhash");
  let a = document.createElement("a");
  a.href = `https://goerli.etherscan.io/tx/${txn.hash}`;
  a.innerHTML = "Follow your transaction here";
  showhash.append(a);
  await txn.wait();
  history.go(0);
}

window.addEventListener("load", connectWallet);
