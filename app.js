 (function () { 
 
 const abi = [{"constant":false,"inputs":[{"name":"hashValue","type":"string"}],"name":"logHashValue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"string"},{"indexed":false,"name":"","type":"address"},{"indexed":false,"name":"","type":"uint256"}],"name":"NewHashValue","type":"event"}]; 
 
 if (window.ethereum) { 
 ethereum.enable().then(function () { 
 const web3 = new Web3(ethereum); 
 const contract = new web3.eth.Contract(abi, "0x245eDE9dac68B84f329e21024E0083ce432700f9"); 
 contract.getPastEvents("NewHashValue", {fromBlock: 0, toBlock: 'latest'}, function (error, events) { 
 console.log(events); 
 const data = events.map(function (event) { 
 return { 
 blockNumber: event.blockNumber, 
 senderAddress: event.returnValues[1], 
 timestamp: new Date(event.returnValues[2] * 1000).toDateString(), 
 hashValue: event.returnValues[0], 
 } 
 }); 
 
 window.showDataAsTable("body", data); 
 }); 
 }) 
 } else { 
 window.alert("No injected ethereum object found"); 
 } 
 })() 
