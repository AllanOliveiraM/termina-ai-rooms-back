export class MemoryStore<T> {
  constructor() {
    this.items = new Map<string, T>()
  }

  private readonly items: Map<string, T>

  get(key: string): T | undefined {
    return this.items.get(key)
  }

  set(key: string, value: T): T {
    this.items.set(key, value)
    return value
  }

  delete(key: string): boolean {
    return this.items.delete(key)
  }

  getAll(): T[] {
    return Array.from(this.items.values())
  }
}
