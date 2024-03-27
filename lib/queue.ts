export class Queue<T> {

  public constructor(
    private elements: Record<number, T> = {},
    private head: number = 0,
    private tail: number = 0
  ) {
  }

  public put(element: T): void {
    this.elements[this.tail] = element;
    this.tail++;
  }

  public pop(): T {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;

    return item;
  }

  public peek(): T {
    return this.elements[this.head];
  }

  public get length(): number {
    return this.tail - this.head;
  }

  public get isEmpty(): boolean {
    return this.length === 0;
  }

  public getAll(): T[] {
    return Object.values(this.elements).slice(this.head, this.tail);
  }

}
