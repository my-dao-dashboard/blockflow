type BlockHash = string;
type BlockNumber = number;

export class ReorgSet {
  private items = new Map<number, BlockHash>();

  constructor(readonly maxSize: number = 20) {}

  has(blockNumber: BlockNumber) {
    return this.items.has(blockNumber);
  }

  add(blockNumber: BlockNumber, blockHash: BlockHash) {
    this.items.set(blockNumber, blockHash);
    this.cleanup();
  }

  cleanup() {
    const currentSize = this.items.size;
    if (currentSize > this.maxSize) {
      const oldest = Array.from(this.items.keys()).sort()[0];
      this.items.delete(oldest);
    }
  }
}
