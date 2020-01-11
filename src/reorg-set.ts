type BlockHash = string;
type BlockNumber = number;

interface BlockInfo {
  totalDifficulty: number;
  blockHash: BlockHash;
}

export class ReorgSet {
  private items = new Map<number, BlockInfo>();

  constructor(readonly maxSize: number = 20) {}

  has(blockNumber: BlockNumber) {
    return this.items.has(blockNumber);
  }

  add(blockNumber: BlockNumber, blockHash: BlockHash, totalDifficulty: number) {
    this.items.set(blockNumber, { blockHash, totalDifficulty: totalDifficulty });
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
