import { Observable } from "rxjs";
import { BlockHeader } from "web3-eth";
import Web3 from "web3";

export class BlocksObservable extends Observable<BlockHeader> {
  constructor(ethereumEndpoint: string) {
    super(observer => {
      const provider = new Web3.providers.WebsocketProvider(ethereumEndpoint);
      const web3 = new Web3(provider);
      const subscription = web3.eth.subscribe("newBlockHeaders");
      console.log(`Subscribed to ${ethereumEndpoint}`);
      subscription.on("data", async blockHeader => {
        observer.next(blockHeader);
      });
      subscription.on("error", error => {
        console.log(`Received error while connecting to ${ethereumEndpoint}`);
        observer.error(error);
      });
    });
  }
}
