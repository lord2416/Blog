class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [Infinity];
  }
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }
  push(val) {
    this.stack.push(val);
    const min = Math.min(this.getMin(), val);
    this.minStack.push(min);
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}

var minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
console.log(minStack.getMin());
minStack.pop();
minStack.top();
console.log(minStack.getMin());