"use client";
import { v4 as uuidv4 } from "uuid";
import { Address, Cell, beginCell, storeStateInit, toNano } from "ton-core";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { Button } from "@/components/ui/button";
import { requestDepositUSDC } from "@/services/helpers/depositHelper";
import { useState } from "react";

export default function Deposits() {
  const address = useTonAddress();
  const [tonConnectUi] = useTonConnectUI();
  const [jettonAmount, setJettonAmount] = useState(0);

  async function getJettonAddressFromWallet() {
    const JETTON_WALLET_CODE = Cell.fromBoc(
      Buffer.from(
        "b5ee9c7201021101000323000114ff00f4a413f4bcf2c80b0102016202030202cc0405001ba0f605da89a1f401f481f481a8610201d40607020120080900c30831c02497c138007434c0c05c6c2544d7c0fc03383e903e900c7e800c5c75c87e800c7e800c1cea6d0000b4c7e08403e29fa954882ea54c4d167c0278208405e3514654882ea58c511100fc02b80d60841657c1ef2ea4d67c02f817c12103fcbc2000113e910c1c2ebcb853600201200a0b0083d40106b90f6a2687d007d207d206a1802698fc1080bc6a28ca9105d41083deecbef09dd0958f97162e99f98fd001809d02811e428027d012c678b00e78b6664f6aa401f1503d33ffa00fa4021f001ed44d0fa00fa40fa40d4305136a1522ac705f2e2c128c2fff2e2c254344270542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c920f9007074c8cb02ca07cbffc9d004fa40f40431fa0020d749c200f2e2c4778018c8cb055008cf1670fa0217cb6b13cc80c0201200d0e009e8210178d4519c8cb1f19cb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08209c9c380a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed5402f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a019ad822860822625a028062849e5c412440e0dd7c138c34975c2c0600f1000d73b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b08160824c4b402805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b552000705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718010c8cb0524cf165006fa0215cb6a14ccc971fb0010241023007cc30023c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed54",
        "hex"
      )
    )[0];
    const JETTON_MASTER_ADDRESS = Address.parse(
      "kQCrJh3cFSTkKULuv2XPLEZDIQ387OHrZwcsPqB8gs1Tc5cz"
    );
    const USER_ADDRESS = Address.parse(address);

    const jettonWalletStateInit = beginCell()
      .store(
        storeStateInit({
          code: JETTON_WALLET_CODE,
          data: beginCell()
            .storeCoins(0)
            .storeAddress(USER_ADDRESS)
            .storeAddress(JETTON_MASTER_ADDRESS)
            .storeRef(JETTON_WALLET_CODE)
            .endCell(),
        })
      )
      .endCell();
    const userJettonWalletAddress = new Address(
      0,
      jettonWalletStateInit.hash()
    );

    return userJettonWalletAddress.toString();
  }

  const sendTransaction = async () => {
    const jettonWalletAddress = await getJettonAddressFromWallet();

    if (!tonConnectUi.connected) {
      alert("Please connect your wallet first!");
      return;
    }
    const uuid = uuidv4();

    const forwardPayload = beginCell()
      .storeUint(0, 32) // No operation
      .storeStringTail(uuid)
      .endCell();

    // const jettonAmount = 8; // Amount of jettons to send
    const forwardTonAmount = 0.05; // Amount of TON to forward

    const body = beginCell()
      .storeUint(0xf8a7ea5, 32) // op: transfer
      .storeUint(0, 64) // query_id
      .storeCoins(toNano(jettonAmount))
      .storeAddress(
        Address.parse("0QAtwf9w_FmP-wPgiwmaJYRjq3KBgeLkMYj012h0xJMQOTlv")
      )
      .storeAddress(Address.parse(address))
      .storeMaybeRef(null)
      .storeCoins(toNano(forwardTonAmount))
      .storeMaybeRef(forwardPayload)
      .endCell();

    try {
      const res = await requestDepositUSDC(uuid);

      const result = await tonConnectUi.sendTransaction({
        messages: [
          {
            address: jettonWalletAddress, // Your jetton wallet address
            amount: toNano(0.1).toString(), // Transaction fee
            payload: body.toBoc().toString("base64"),
          },
        ],
        validUntil: Math.floor(Date.now() / 1000) + 360, // Valid for 5 minutes
      });

      console.log("Transaction sent successfully:", result);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. See console for details.");
    }
  };
  return (
    <div className="h-screen">
      <div className="flex flex-col items-center space-y-4 p-6 bg-gray-800 rounded-lg shadow-lg h-full">
        <h2 className="text-2xl font-bold text-white mb-4">Deposit USDC</h2>
        <div className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Enter USDC amount"
            className="w-full px-4 py-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setJettonAmount(Number(e.target.value))}
          />
          <Button
            type="button"
            onClick={sendTransaction}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Deposit USDC
          </Button>
        </div>
      </div>
    </div>
  );
}
