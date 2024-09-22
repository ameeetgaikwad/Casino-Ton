// "use client";
// import TonConnect, { toUserFriendlyAddress } from "@tonconnect/sdk";
// // import { useEffect } from "react";
// import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
// import { Address, Cell, beginCell, storeStateInit, toNano } from "ton-core";
// import { TonConnectButton } from "@tonconnect/ui-react";
// // import { TonClient, JettonMaster } from "@ton/ton";
// import { v4 as uuidv4 } from "uuid";

// // import {
// //   keyPairFromSeed,
// //   keyPairFromSecretKey,
// //   sign,
// //   signVerify,
// //   KeyPair,
// //   getSecureRandomBytes,
// // } from "ton-crypto";
// import { requestDepositUSDC } from "@/services/helpers/depositHelper";

// export default function Tontest() {
//   // const client = new TonClient({
//   //   endpoint: "https://toncenter.com/api/v2/jsonRPC",
//   // });
//   const address = useTonAddress();

//   async function getJettonAddressFromWallet() {
//     const JETTON_WALLET_CODE = Cell.fromBoc(
//       Buffer.from(
//         "b5ee9c7201021101000323000114ff00f4a413f4bcf2c80b0102016202030202cc0405001ba0f605da89a1f401f481f481a8610201d40607020120080900c30831c02497c138007434c0c05c6c2544d7c0fc03383e903e900c7e800c5c75c87e800c7e800c1cea6d0000b4c7e08403e29fa954882ea54c4d167c0278208405e3514654882ea58c511100fc02b80d60841657c1ef2ea4d67c02f817c12103fcbc2000113e910c1c2ebcb853600201200a0b0083d40106b90f6a2687d007d207d206a1802698fc1080bc6a28ca9105d41083deecbef09dd0958f97162e99f98fd001809d02811e428027d012c678b00e78b6664f6aa401f1503d33ffa00fa4021f001ed44d0fa00fa40fa40d4305136a1522ac705f2e2c128c2fff2e2c254344270542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c920f9007074c8cb02ca07cbffc9d004fa40f40431fa0020d749c200f2e2c4778018c8cb055008cf1670fa0217cb6b13cc80c0201200d0e009e8210178d4519c8cb1f19cb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08209c9c380a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed5402f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a019ad822860822625a028062849e5c412440e0dd7c138c34975c2c0600f1000d73b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b08160824c4b402805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b552000705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718010c8cb0524cf165006fa0215cb6a14ccc971fb0010241023007cc30023c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed54",
//         "hex"
//       )
//     )[0];
//     const JETTON_MASTER_ADDRESS = Address.parse(
//       "kQCrJh3cFSTkKULuv2XPLEZDIQ387OHrZwcsPqB8gs1Tc5cz"
//     );
//     const USER_ADDRESS = Address.parse(address);

//     const jettonWalletStateInit = beginCell()
//       .store(
//         storeStateInit({
//           code: JETTON_WALLET_CODE,
//           data: beginCell()
//             .storeCoins(0)
//             .storeAddress(USER_ADDRESS)
//             .storeAddress(JETTON_MASTER_ADDRESS)
//             .storeRef(JETTON_WALLET_CODE)
//             .endCell(),
//         })
//       )
//       .endCell();
//     const userJettonWalletAddress = new Address(
//       0,
//       jettonWalletStateInit.hash()
//     );

//     return userJettonWalletAddress.toString();
//   }
//   getJettonAddressFromWallet();
//   // async function privateKeySign() {
//   //   const data = Buffer.from("yoyo");
//   //   console.log("get me is dif");
//   //   const seed: Buffer = await getSecureRandomBytes(32); // Seed is always 32 bytes
//   //   const keypair: KeyPair = keyPairFromSeed(seed); // Creates

//   //   // Sign
//   //   const signatureOG = sign(data, keypair.secretKey);
//   //   console.log("signatureOg", signatureOG);

//   //   console.log("public key OG", keypair.publicKey);

//   //   // ------------------------------------------------------------------

//   //   const valid: boolean = signVerify(data, signatureOG, keypair.publicKey);
//   //   console.log("valid", valid);
//   // }

//   const walletConnectionSource = {
//     universalLink: "https://app.tonkeeper.com/ton-connect",
//     bridgeUrl: "https://bridge.tonapi.io/bridge",
//   };

//   const connector = new TonConnect({
//     manifestUrl: process.env.NEXT_PUBLIC_MANIFEST_URL,
//   });

//   const universalLink = connector.connect(walletConnectionSource);

//   const [tonConnectUi] = useTonConnectUI();
//   // function signW() {
//   //   console.log("sign");
//   //   // Should correspond to the wallet that user selects
//   //   const walletConnectionSource = {
//   //     jsBridgeKey: "tonkeeper",
//   //   };

//   //   connector.connect(walletConnectionSource, {
//   //     tonProof: "yoyo",
//   //   });
//   //   // console.log(tonConnectUi.account?.publicKey, "kidding2");
//   // }

//   // connector.onStatusChange(async (wallet) => {
//   //   if (!wallet) {
//   //     return;
//   //   }
//   //   const tonProof = wallet.connectItems?.tonProof;
//   //   console.log("we are here", tonProof);
//   //   console.log("acounnt", wallet.account);
//   //   if (tonProof) {
//   //     if ("proof" in tonProof) {
//   //       console.log("proof very secrect", tonProof.proof);
//   //       // send proof to your backend
//   //       // e.g. myBackendCheckProof(tonProof.proof, wallet.account);
//   //       return;
//   //     }
//   //     console.error(tonProof.error);
//   //   }
//   //   console.log("trying to sign huh?", wallet);
//   // });

//   // const connector = new TonConnect({
//   //   manifestUrl: "http://localhost:3000/manifest.json",
//   // });
//   // const walletConnectionSource = {
//   //   jsBridgeKey: "tonkeeper",
//   // };
//   // const unsubscribe = connector.onStatusChange((walletInfo) => {
//   //   // update state/reactive variables to show updates in the ui
//   //   console.log(walletInfo, "wallet info");
//   // });

//   // useEffect(() => {
//   //   if (!connector.connected) {
//   //     alert("Please connect wallet to send the transaction!");
//   //   }
//   //   connector.restoreConnection();
//   //   unsubscribe();
//   // }, []);

//   const sendTransaction = async () => {
//     const jettonWalletAddress = await getJettonAddressFromWallet();

//     if (!tonConnectUi.connected) {
//       alert("Please connect your wallet first!");
//       return;
//     }
//     const uuid = uuidv4();

//     const forwardPayload = beginCell()
//       .storeUint(0, 32) // No operation
//       .storeStringTail(uuid)
//       .endCell();

//     const jettonAmount = 8; // Amount of jettons to send
//     const forwardTonAmount = 0.05; // Amount of TON to forward

//     const body = beginCell()
//       .storeUint(0xf8a7ea5, 32) // op: transfer
//       .storeUint(0, 64) // query_id
//       .storeCoins(toNano(jettonAmount))
//       .storeAddress(
//         Address.parse("0QAtwf9w_FmP-wPgiwmaJYRjq3KBgeLkMYj012h0xJMQOTlv")
//       )
//       .storeAddress(Address.parse(address))
//       .storeMaybeRef(null)
//       .storeCoins(toNano(forwardTonAmount))
//       .storeMaybeRef(forwardPayload)
//       .endCell();

//     try {
//       const res = await requestDepositUSDC(uuid);
//       const result = await tonConnectUi.sendTransaction({
//         messages: [
//           {
//             address: jettonWalletAddress, // Your jetton wallet address
//             amount: toNano(0.5).toString(), // Transaction fee
//             payload: body.toBoc().toString("base64"),
//           },
//         ],
//         validUntil: Math.floor(Date.now() / 1000) + 360, // Valid for 5 minutes
//       });

//       console.log("Transaction sent successfully:", result);
//     } catch (error) {
//       console.error("Transaction failed:", error);
//       alert("Transaction failed. See console for details.");
//     }
//   };

//   function getAddress() {
//     const address = toUserFriendlyAddress(
//       "0:b3f53cc09a162b1d1e2de0aa8bb52831cc38b205ccb219c917d9f5a1559228b8",
//       true
//     );
//     console.log("address", address);
//   }

//   // async function testSign() {
//   //   const tx = await tonConnectUi.sendTransaction({
//   //     validUntil: Math.floor(Date.now() / 1000) + 60, // Valid for 60 seconds
//   //     messages: [
//   //       {
//   //         address: "0QAtwf9w_FmP-wPgiwmaJYRjq3KBgeLkMYj012h0xJMQOTlv", // Replace with the recipient's address
//   //         amount: "0", // Amount in nanoTONs (1 TON = 1e9 nanoTONs)
//   //         payload: "", // Optional: Add payload if needed
//   //         stateInit: "", // Optional: Include stateInit if required
//   //       },
//   //     ],
//   //   });
//   //   console.log("tx", tx);
//   // }

//   // function walletSign() {
//   //   const walletSignatureBase64 =
//   //     "dXGWcz+WdxuHIX/8AzcL1hy0uIGvdBVRDKqmYH6mPWKT6cWPL9Rfbg0NyAuAnjt71MRTgyEIwKkzjA02U9mwCg==";
//   //   const signatureBuffer = Buffer.from(walletSignatureBase64, "base64");
//   //   console.log("signate wallet", signatureBuffer);
//   //   //===========================================================
//   //   // const hexString =
//   //   //   "d3b0d3f599a7bb31327db099c8693aae1b8544fff6c2b0532a22dde0f4c09175";

//   //   // const buffer = Buffer.from(hexString, "hex");

//   //   // const bufferObject = {
//   //   //   type: "Buffer",
//   //   //   data: Array.from(buffer),
//   //   // };
//   //   // const tempPublickey = new Uint8Array(bufferObject.data);
//   //   //=================================================================
//   //   const publicKey2 = Buffer.from(
//   //     "d3b0d3f599a7bb31327db099c8693aae1b8544fff6c2b0532a22dde0f4c09175",
//   //     "hex"
//   //   );

//   //   console.log("public key wallet2", publicKey2);

//   //   const messageCell = beginCell().storeStringTail("yoyo").endCell();

//   //   // Get the hash of the message cell
//   //   const messageHash = messageCell.hash();

//   //   const valid: boolean = signVerify(messageHash, signatureBuffer, publicKey2);
//   //   console.log("valid", valid);
//   // }

//   ////////////////

//   return (
//     <div>
//       Test
//       <TonConnectButton />
//       <button
//         type="button"
//         onClick={sendTransaction}
//         className="bg-red-500 p-4"
//       >
//         Send Transaction
//       </button>
//       {/* <button onClick={signW} className="bg-red-500 p-4 ml-4">
//         sign
//       </button>
//       <button onClick={privateKeySign} className="bg-red-500 p-4 ml-4">
//         priate key sign
//       </button>
//       <button onClick={walletSign} className="bg-red-500 p-4 ml-4">
//         wallet sign
//       </button>
//       <button onClick={getAddress} className="bg-red-500 p-4 ml-4">
//         get address
//       </button> */}
//       {/* <button onClick={testSign} className="bg-red-500 p-4 ml-4">
//         Test sign
//       </button> */}
//     </div>
//   );
// }

export default function Tontest() {
  return <div>Tontest</div>;
}
