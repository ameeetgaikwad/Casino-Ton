"use client";
import TonConnect, { toUserFriendlyAddress } from "@tonconnect/sdk";
import { useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { beginCell } from "ton-core";

import {
  keyPairFromSeed,
  keyPairFromSecretKey,
  sign,
  signVerify,
  KeyPair,
  getSecureRandomBytes,
  mnemonicToWalletKey,
} from "ton-crypto";
import { buffer } from "stream/consumers";

export default function Test() {
  const walletConnectionSource = {
    universalLink: "https://app.tonkeeper.com/ton-connect",
    bridgeUrl: "https://bridge.tonapi.io/bridge",
  };

  const connector = new TonConnect({
    manifestUrl: process.env.NEXT_PUBLIC_MANIFEST_URL,
  });

  const universalLink = connector.connect(walletConnectionSource);

  const [tonConnectUi] = useTonConnectUI();
  function signW() {
    console.log("sign");
    // Should correspond to the wallet that user selects
    const walletConnectionSource = {
      jsBridgeKey: "tonkeeper",
    };
    const buff = Buffer.from("yoyo", "utf-8");

    connector.connect(walletConnectionSource, {
      tonProof: buff,
    });
    // console.log(tonConnectUi.account?.publicKey, "kidding2");
  }

  connector.onStatusChange(async (wallet) => {
    if (!wallet) {
      return;
    }
    const tonProof = wallet.connectItems?.tonProof;
    console.log("we are here", tonProof);
    console.log("acounnt", wallet.account);
    if (tonProof) {
      if ("proof" in tonProof) {
        console.log("proof very secrect", tonProof.proof);
        // send proof to your backend
        // e.g. myBackendCheckProof(tonProof.proof, wallet.account);
        return;
      }
      console.error(tonProof.error);
    }
    console.log("trying to sign huh?", wallet);
  });

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

  // useEffect(() => {
  //   if (!connector.connected) {
  //     alert("Please connect wallet to send the transaction!");
  //   }
  //   connector.restoreConnection();
  //   unsubscribe();
  // }, []);

  // async function testSign() {
  //   const tx = await tonConnectUi.sendTransaction({
  //     validUntil: Math.floor(Date.now() / 1000) + 60, // Valid for 60 seconds
  //     messages: [
  //       {
  //         address: "0QAtwf9w_FmP-wPgiwmaJYRjq3KBgeLkMYj012h0xJMQOTlv", // Replace with the recipient's address
  //         amount: "0", // Amount in nanoTONs (1 TON = 1e9 nanoTONs)
  //         payload: "", // Optional: Add payload if needed
  //         stateInit: "", // Optional: Include stateInit if required
  //       },
  //     ],
  //   });
  //   console.log("tx", tx);
  // }

  function walletSign() {
    const message = "yoyo";
    const signature =
      "ZcMlIDwaYaK5v7Ntm8vfjMXHhN+nGo87wWUNFnB6SVGC4t4Fpfnzt0LqOcleS9kKmumyWGDfom4i10H8v2L3Cw==";
    const publicKeyHex =
      "d3b0d3f599a7bb31327db099c8693aae1b8544fff6c2b0532a22dde0f4c09175";

    const signatureBuffer = Buffer.from(signature, "base64");
    console.log("signate wallet", signatureBuffer);

    const publicKeyBuffer = Buffer.from(publicKeyHex, "hex");
    console.log("public key", publicKeyBuffer);

    const messageCell = beginCell().storeStringTail(message).endCell();
    console.log("message cell", messageCell);
    // Get the hash of the message cell
    const messageHash = messageCell.hash();
    console.log("message hash", messageHash);

    const isValid = signVerify(messageHash, signatureBuffer, publicKeyBuffer);
    console.log("is valid", isValid);
  }

  async function getSignature() {
    const data = Buffer.from("yoyo");
    const data2 = Buffer.from("yoyo1");
    const seed =
      "grit once regular sound miss main consider minor grab like planet soul display family any muffin skirt silk carpet dish love detail culture spoil";
    const mnemonicWords = seed.trim().split(/\s+/);

    const key = await mnemonicToWalletKey(mnemonicWords);

    // The `key` object contains both public and secret keys
    const keypair: KeyPair = {
      publicKey: key.publicKey,
      secretKey: key.secretKey,
    };

    const signatureOG = sign(data, keypair.secretKey);
    console.log("signatureOg", signatureOG);

    console.log("Public Key:", keypair.publicKey.toString("hex"));

    const valid: boolean = signVerify(data, signatureOG, keypair.publicKey);
    console.log("valid", valid);
  }

  return (
    <div>
      Test
      <button onClick={signW} className="bg-red-500 p-4 ml-4">
        sign
      </button>
      <button onClick={walletSign} className="bg-red-500 p-4 ml-4">
        wallet sign
      </button>
      <button onClick={getSignature} className="bg-red-500 p-4 ml-4">
        get the signature from my private keys
      </button>
    </div>
  );
}
