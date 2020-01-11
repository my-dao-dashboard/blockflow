type BlockNumber = number;
type BlockHash = string;

export class ReorgSet {
  private items = new Map<BlockNumber, BlockHash>();

  constructor(readonly maxLength: number = 10) {}

  has(id: BlockNumber): boolean {
    return this.items.has(id);
  }

  add(id: BlockNumber, hash: BlockHash) {
    this.items.set(id, hash);
    const allNumbers = Array.from(this.items.keys()).sort();
    if (allNumbers.length > this.maxLength) {
      const earliest = allNumbers[0];
      this.items.delete(earliest);
    }
  }
}
