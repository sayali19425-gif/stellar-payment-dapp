import "./style.css";
import* as StellarSdk from "@stellar/stellar-sdk";
import { requestAccess, getAddress, signTransaction } from "@stellar/freighter-api";

const server = new StellarSdk.Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const walletAddressEl = document.getElementById("walletAddress");
const balanceEl = document.getElementById("balance");
const sendBtn = document.getElementById("sendBtn");
const messageEl = document.getElementById("message");

let publicKey = "";//store address

//connect wallet
connectBtn.onclick = async () => {
  try {
    const access = await requestAccess();

    console.log("Access result:", access);

    if (access.error) {
      messageEl.innerText = access.error;
      return;
    }

    const addressObj = await getAddress();
    publicKey = addressObj.address;  

    walletAddressEl.innerText = publicKey;

    const account = await server.loadAccount(publicKey);
    const xlmBalance = account.balances.find(
      (b) => b.asset_type === "native"
    );

    if (xlmBalance) {
      balanceEl.innerText = xlmBalance.balance + " XLM";
    } else {
      balanceEl.innerText = "0 XLM";
    }

    messageEl.innerText = "Wallet Connected ";

  } catch (error) {
    console.error("Full error:", error);
    messageEl.innerText = "Connection Failed ";
  }
};


//disconnect logic
disconnectBtn.onclick= ()=>{
  publicKey="";
  walletAddressEl.innerText="";
  balanceEl.innerText="";
  messageEl.innerText="Wallet Disconnected";
};

//send XLM
sendBtn.onclick= async()=>{
  try{
    if(!publicKey){
      messageEl.innerText="connect wallet first";
      return;
    }
    const destination= document.getElementById("destination").value;
    const amount= document.getElementById("amount").value;

    const sourceAccount= await server.loadAccount(publicKey);
    const fee = await server.fetchBaseFee();

    const transaction= new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: fee.toString(),
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
    .addOperation(
      StellarSdk.Operation.payment({
        destination:destination,
        asset: StellarSdk.Asset.native(),
        amount: amount,
      })
    )
    .setTimeout(30)
    .build();

    const signed= await signTransaction(transaction.toXDR(),{
      networkPassphrase: StellarSdk.Networks.TESTNET
    });
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signed.signedTxXdr,
      StellarSdk.Networks.TESTNET
    );
    const result = await server.submitTransaction(signedTx);
    messageEl.innerText= "transaction success";
  } catch(error){
    messageEl.innerText="transaction failed";
  }
};
