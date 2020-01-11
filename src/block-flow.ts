import { BlockFlowConfig } from "./block-flow-config";
import { BlocksObservable } from "./blocks.observable";
import { retry } from "rxjs/operators";
import { BlockHeader } from "web3-eth";
import { ReorgSet } from "./reorg-set";
import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 5, retryCondition: () => true });

export class BlockFlow {
  private readonly reorgSet = new ReorgSet();

  constructor(private readonly config: BlockFlowConfig) {}

  async notifySinks(blockNumber: number, blockHash: string) {
    this.reorgSet.add(blockNumber, blockHash);
    await Promise.all(
      this.config.sinks.map(async sink => {
        try {
          await axios.post(sink, {
            id: blockNumber
          });
        } catch (e) {
          console.error(e);
        }
      })
    );
  }

  async handleNewBlock(blockHeader: BlockHeader) {
    const blockNumber = blockHeader.number;
    const blockHash = blockHeader.hash;
    const isSeen = this.reorgSet.has(blockNumber);
    if (isSeen) {
      console.log(`Block ${blockNumber}: ${blockHash} REORG`);
    } else {
      console.log(`Block ${blockNumber}: ${blockHash}`);
    }
    await this.notifySinks(blockNumber, blockHash);
  }

  start() {
    new BlocksObservable(this.config.ethereumEndpoint).pipe(retry(2)).subscribe(async blockHeader => {
      await this.handleNewBlock(blockHeader);
    });
  }
}
