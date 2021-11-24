Moralis.initialize('JgyCdEhFuQo5aZEzyL2x4qfNgNCBasxGSoi7BBc0');
Moralis.serverURL = 'https://ngyp8xpeq61g.usemoralis.com:2053/server';
;

var web3 = new Web3(web3.currentProvider);
const contractAddress = '0x78E470243c06F5BA00B37D068e10669D4a684D44';
$(document).ready(function () {
    window.ethereum.enable().then(function(accounts) {
        contractInstance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]});
        $("#addPolygon").click(addPolygon);
        $("#buyButton").click(buy);
        $("#uploadButton").click(upload);
        $("#loginButton").click(login);
        $("#logout").click(logout);
        init();
    });
});

/*
https://ipfs.moralis.io:2053/ipfs/QmdaKvLxSKmAff1jZnpJ3tSkc9Q4GseSb3EAo6QtTwq3Tg
https://ipfs.moralis.io:2053/ipfs/QmdJmzWp2mg4gR44kwTvfFTHsz9a6h5AifV3LsYJKcsDqP
https://ipfs.moralis.io:2053/ipfs/QmQYgKwQwZyQR7UMgwottR1q9pQib1TGSs5u1KAiFBAyEs
https://ipfs.moralis.io:2053/ipfs/QmbmGHfUsecgffaKTRAX2H7qjTbsza7AdriQgZX4D4R6ZC
https://ipfs.moralis.io:2053/ipfs/QmSq72g6UZ2DQvwb2yFqofhs6Kfp5uko1DM3JozXh8UWg8
https://ipfs.moralis.io:2053/ipfs/QmUSrNpss6CMekQWqUgBKRyZbZ1UBMa9jqktLLu2bTYre7
["https://ipfs.moralis.io:2053/ipfs/QmdaKvLxSKmAff1jZnpJ3tSkc9Q4GseSb3EAo6QtTwq3Tg", "https://ipfs.moralis.io:2053/ipfs/QmdJmzWp2mg4gR44kwTvfFTHsz9a6h5AifV3LsYJKcsDqP", "https://ipfs.moralis.io:2053/ipfs/QmQYgKwQwZyQR7UMgwottR1q9pQib1TGSs5u1KAiFBAyEs", "https://ipfs.moralis.io:2053/ipfs/QmbmGHfUsecgffaKTRAX2H7qjTbsza7AdriQgZX4D4R6ZC", "https://ipfs.moralis.io:2053/ipfs/QmSq72g6UZ2DQvwb2yFqofhs6Kfp5uko1DM3JozXh8UWg8", "https://ipfs.moralis.io:2053/ipfs/QmUSrNpss6CMekQWqUgBKRyZbZ1UBMa9jqktLLu2bTYre7"]
*/

var user = Moralis.User.current();
async function init() {
    hideElement(uploadSection);
    if(Moralis.User.current() == null) {
        await login();
    } else {
        hideElement(document.getElementById("loginButton"));
    }  
    if(user.get('ethAddress') == '0x1dd7134a77f5e3e2e63162bbdcfd494140908270') {
        showElement(uploadSection);
    }

    console.log(user.get('ethAddress'));
}

async function buy() {
    const log = await contractInstance.methods.buy().send({from: Moralis.User.current().get("ethAddress"), value: 10000000000000000000});
    console.log(log);
}

addPolygon = async () => {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }],
      });
    } catch (switchError) {
      //This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({method: 'wallet_addEthereumChain', params: [{ nativeCurrency: {name: 'MATIC', symbol: 'MATIC', decimals: 18}, chainName: 'Polygon', chainId: '0x89', rpcUrls: ['https://matic-mainnet.chainstacklabs.com'], blockExplorerUrls: ['https://polygonscan.com/'], iconUrls: ['https://polygon.technology/media-kit/matic-token-icon.png'] }],});
        } catch (addError) {
          //handle "add" error
        }
      }
      //handle other "switch" errors
    }
}

async function upload() {
    const fileInput = document.getElementById("file");
    const description = document.getElementById("description").value;
    const data = fileInput.files[0];
    const file = new Moralis.File(data.name, data);
    await file.saveIPFS();
    const link = file.ipfs();
    const object = {
        "description" : description,
        "image" : link
    };
    const obj = new Moralis.File("file.json", {base64 : btoa(JSON.stringify(object))});
    await obj.saveIPFS();
    console.log(obj.ipfs());
    // console.log(link);
}

async function login() {
    user = await Moralis.authenticate();
    hideElement(document.getElementById("loginButton"));
    showElement(document.getElementById("logout"));
}

async function logout() {
    user = await Moralis.User.logOut();
    hideElement(document.getElementById("logout"));
    showElement(document.getElementById("loginButton"));
}

showElement = (element) => element.style.display = "block";
hideElement = (element) => element.style.display = "none";
