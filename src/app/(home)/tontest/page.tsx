"use client";
import TonConnect from "@tonconnect/sdk";
import { useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";

export default function Test() {
  const [tonConnectUi] = useTonConnectUI();

  // const connector = new TonConnect({
  //   manifestUrl: "http://localhost:3000/manifest.json",
  // });
  // const walletConnectionSource = {
  //   jsBridgeKey: "tonkeeper",
  // };
  // const unsubscribe = connector.onStatusChange((walletInfo) => {
  //   // update state/reactive variables to show updates in the ui
  //   console.log(walletInfo, "wallet info");
  // });

  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
    messages: [
      {
        address: "0QAtwf9w_FmP-wPgiwmaJYRjq3KBgeLkMYj012h0xJMQOTlv",
        amount: "2000",
        // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
      },
    ],
  };

  // useEffect(() => {
  //   if (!connector.connected) {
  //     alert("Please connect wallet to send the transaction!");
  //   }
  //   connector.restoreConnection();
  //   unsubscribe();
  // }, []);

  const sendTransaction = async () => {
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // Valid for 60 seconds
        messages: [
          {
            address: "0QAtwf9w_FmP-wPgiwmaJYRjq3KBgeLkMYj012h0xJMQOTlv", // Replace with the recipient's address
            amount: (1 * 1e6).toString(), // Amount in nanoTONs (1 TON = 1e9 nanoTONs)
            payload: "", // Optional: Add payload if needed
            stateInit: "", // Optional: Include stateInit if required
          },
        ],
      };

      // Send the transaction using tonConnectUi
      const result = await tonConnectUi.sendTransaction(transaction);

      alert("Transaction sent successfully!");
      console.log("Transaction result:", result);
    } catch (error) {
      console.error("Transaction failed:", error);
      if (error instanceof Error && error.message.includes("User rejected")) {
        alert("Transaction was rejected by the user.");
      } else {
        alert("An error occurred while sending the transaction.");
      }
    }
  };

  return (
    <div>
      Test
      <button onClick={sendTransaction}>Send Transaction</button>
    </div>
  );
}
