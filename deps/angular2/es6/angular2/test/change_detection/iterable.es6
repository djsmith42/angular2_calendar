export class TestIterable {
  constructor() {
    this.list = [];
  }
  [Symbol.iterator]() {
    return this.list[Symbol.iterator]();
  }
}

//# sourceMappingURL=/Users/patrick/Documents/open source/angular/modules/angular2/test/change_detection/iterable.map

//# sourceMappingURL=./iterable.map