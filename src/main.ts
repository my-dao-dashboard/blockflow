import Web3 from "web3";
import axios from "axios";
import { ReorgSet } from "./reorg-set";

const ETHEREUM_WS_ENDPOINT = "ws://mainnet.eth.daoscan.net:8546";
const PARSE_BLOCK_ENDPOINT = "https://daoscan.net/block";

async function parseBlockCommand(blockNumber: number) {
  await axios.post(PARSE_BLOCK_ENDPOINT, {
    id: blockNumber
  })
}

function main() {
  const provider = new Web3.providers.WebsocketProvider(ETHEREUM_WS_ENDPOINT);
  const web3 = new Web3(provider);
  const reorgSet = new ReorgSet();

  const subscription = web3.eth.subscribe("newBlockHeaders");
  console.log(`Subscribed to ${ETHEREUM_WS_ENDPOINT}`);
  subscription.on("data", async blockHeader => {
    const blockNumber = blockHeader.number;
    const hash = blockHeader.hash;
    const isPresent = reorgSet.has(blockNumber);
    const reorgLabel = isPresent ? " REORG" : "";
    console.log(`New block ${blockNumber}: ${hash}${reorgLabel}`);
    reorgSet.add(blockNumber, hash);
    try {
      await parseBlockCommand(blockNumber)
    } catch (e) {
      console.error(e)
    }
  });
  subscription.on("error", error => {
    console.log(`Received error while connecting to ${ETHEREUM_WS_ENDPOINT}`);
    console.error(error);
  });
}

main();
