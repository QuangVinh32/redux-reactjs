export class Mutex {
  private locked = false;
  private waiters: Array<() => void> = [];

  async acquire(): Promise<() => void> {
    if (this.locked) {
      await new Promise<void>((resolve) => this.waiters.push(resolve));
    }
    this.locked = true;
    return () => {
      this.locked = false;
      const next = this.waiters.shift();
      if (next) next();
    };
  }

  async wait(): Promise<void> {
    if (!this.locked) return;
    await new Promise<void>((resolve) => this.waiters.push(resolve));
    const next = this.waiters.shift();
    if (next) next();
  }
}
