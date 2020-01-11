import Web3 from "web3";
import axios from "axios";
import axiosRetry from "axios-retry";
import { ReorgSet } from "./reorg-set";
import { BlockHeader } from "web3-eth";
import dotenv from "dotenv";

axiosRetry(axios, { retries: 5, retryCondition: () => true });

dotenv.config();

const ETHEREUM_WS_ENDPOINT = String(process.env.ETHEREUM_WS_ENDPOINT);
const PARSE_BLOCK_ENDPOINT = String(process.env.PARSE_BLOCK_ENDPOINT);

const provider = new Web3.providers.WebsocketProvider(ETHEREUM_WS_ENDPOINT);
const web3 = new Web3(provider);
const reorgSet = new ReorgSet();

async function parseBlockCommand(blockNumber: number, blockHash: string, totalDifficulty: number) {
  try {
    reorgSet.add(blockNumber, blockHash, totalDifficulty);
    await axios.post(PARSE_BLOCK_ENDPOINT, {
      id: blockNumber
    });
  } catch (e) {
    console.error(e);
  }
}

async function handleNewBlock(blockHeader: BlockHeader) {
  const blockNumber = blockHeader.number;
  const blockHash = blockHeader.hash;
  const block = await web3.eth.getBlock(blockHash);
  const isSeen = reorgSet.has(blockNumber);
  if (isSeen) {
    console.log(`Block ${blockNumber}: ${blockHash} REORG`);
  } else {
    console.log(`Block ${blockNumber}: ${blockHash}`);
  }
  await parseBlockCommand(blockNumber, blockHash, block.totalDifficulty);
}

function main() {
  const subscription = web3.eth.subscribe("newBlockHeaders");
  console.log(`Subscribed to ${ETHEREUM_WS_ENDPOINT}`);
  subscription.on("data", async blockHeader => {
    await handleNewBlock(blockHeader);
  });
  subscription.on("error", error => {
    console.log(`Received error while connecting to ${ETHEREUM_WS_ENDPOINT}`);
    console.error(error);
  });
}

main();
