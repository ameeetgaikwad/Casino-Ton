import { ethers } from 'ethers';
import crypto from 'crypto';
import BigNumber from 'bignumber.js';
import * as smartContract from '@/../contract.json';

const provider_rpc_url = "https://bsc-testnet-rpc.publicnode.com";
const provider = new ethers.providers.JsonRpcProvider(provider_rpc_url);
const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY!, provider);

const contractABI = smartContract.Game.COIN.abi
const contractAddress = smartContract.Game.COIN.contractAddress;
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

export function getRandomNumber(min, max) {
    const range = max - min + 1;
    const bytes = crypto.randomBytes(4);
    const randomNumber = bytes.readUInt32BE(0);
    return min + (randomNumber % range);
}

export const GameInitiatedCB = async (gameId: BigNumber,
    player: string,
    guess: number,
    value: BigNumber) => {
    console.log("Coin Flip random number event is called->>>>>");
    // const { gameId, player, guess, amountBet } = event;
    console.log(`New game initiated: ${gameId} by ${player}`);

    // Generate result with 52% house edge
    const randomNumber = getRandomNumber(0, 99);
    const result = randomNumber < 48 ? 1 : 0;
    console.log("RANDOM NUMBER", result);


    try {
        const tx = await contract.resolveGame(gameId, result)
        console.log("tx", tx);
        console.log(`Game ${gameId} resolved with result: ${result}`);
    } catch (error) {
        console.error(`Error resolving game ${gameId}:`, error);
    }
}

// export async function listenForEvents() {
//     console.log("Coin Flip event listener is setup->>>>>");
//     contract.addListener("GameInitiated", async (gameId: BigNumber,
//         player: string,
//         guess: number,
//         value: BigNumber) => {
//         console.log("Data given", gameId, guess, player, value);

//         console.log("Coin Flip random number event is called->>>>>");
//         // const { gameId, player, guess, amountBet } = event;
//         console.log(`New game initiated: ${gameId} by ${player}`);

//         // Generate result with 52% house edge
//         const randomNumber = getRandomNumber(0, 99);
//         const result = randomNumber < 48 ? 1 : 0;
//         console.log("RANDOM NUMBER", result);


//         try {
//             const tx = await contract.resolveGame(gameId, result)
//             console.log("tx", tx);
//             console.log(`Game ${gameId} resolved with result: ${result}`);
//         } catch (error) {
//             console.error(`Error resolving game ${gameId}:`, error);
//         }
//     })
// }

