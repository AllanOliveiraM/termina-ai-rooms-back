import { readFileSync, existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { join } from 'path'

const filenamePersistence = 'memory-store.json'
export class MemoryStore<T> {
  private readonly items: Map<string, T>
  private readonly filenamePersistencePathPath: string

  constructor() {
    this.items = new Map<string, T>()
    this.filenamePersistencePathPath = join(process.cwd(), filenamePersistence)

    this.loadFromDisk()
  }

  private saveToDisk() {
    const obj = Object.fromEntries(this.items)

    writeFile(this.filenamePersistencePathPath, JSON.stringify(obj))
  }

  private loadFromDisk() {
    if (existsSync(this.filenamePersistencePathPath)) {
      const raw = readFileSync(this.filenamePersistencePathPath, 'utf-8')
      const obj = JSON.parse(raw)

      for (const [key, value] of Object.entries(obj)) {
        this.items.set(key, value as T)
      }
    }
  }

  get(key: string): T | undefined {
    return this.items.get(key)
  }

  set(key: string, value: T): T {
    this.items.set(key, value)

    this.saveToDisk()

    return value
  }

  delete(key: string): boolean {
    const result = this.items.delete(key)

    this.saveToDisk()

    return result
  }

  getAll(): T[] {
    return Array.from(this.items.values())
  }

  getAllKeys(): string[] {
    return Array.from(this.items.keys())
  }
}
