# 看看react调度背后的数据结构

## 调度
react调度会处理高优先级的任务, 问题:

1.任务如何存储？
2.如何实现高优先级？
3.效率？

### 任务池
源码详见(react/packages/scheduler/src/forks/Scheduler.js)

```
var taskQueue = []; // 待执行任务
var timerQueue = []; // 可延迟执行任务
```

### 任务
源码详见(react/packages/scheduler/src/forks/Scheduler.js)

```
var newTask = {
  id: taskIdCounter++, // 自增id
  callback, // 回调
  priorityLevel, 
  
// 优先级5个: ImmediatePriority(-1), UserBlockingPriority(250), IdlePriority(maxSigned31BitInt: Math.pow(2, 30) - 1), LowPriority(10000), NormalPriority(5000)
  startTime, // 开始时间
  expirationTime, // 过期时间
  sortIndex: -1, // 排序
};
```
### 任务存取
源码详见(react/packages/scheduler/src/SchedulerMinHeap.js)

```
type Heap = Array<Node>;
type Node = {|
  id: number,
  sortIndex: number,
|};
·
export function push(heap: Heap, node: Node): void {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}

export function peek(heap: Heap): Node | null {
  return heap.length === 0 ? null : heap[0];
}

export function pop(heap: Heap): Node | null {
  if (heap.length === 0) {
    return null;
  }
  const first = heap[0];
  const last = heap.pop();
  if (last !== first) {
    heap[0] = last;
    siftDown(heap, last, 0);
  }
  return first;
}

function siftUp(heap, node, i) {
  let index = i;
  while (index > 0) {
    const parentIndex = (index - 1) >>> 1;
    const parent = heap[parentIndex];
    if (compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}

function siftDown(heap, node, i) {
  let index = i;
  const length = heap.length;
  const halfLength = length >>> 1;
  while (index < halfLength) {
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];

    // If the left or right node is smaller, swap with the smaller of those.
    if (compare(left, node) < 0) {
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (rightIndex < length && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller. Exit.
      return;
    }
  }
}

function compare(a, b) {
  // Compare sort index first, then task id.
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}
```
## 堆
### 概念
堆（英语：Heap）是计算机科学中的一种特别的完全二叉树。若是满足以下特性，即可称为堆：“给定堆中任意节点P和C，若P是C的母节点，那么P的值会小于等于（或大于等于）C的值”。若母节点的值恒小于等于子节点的值，此堆称为最小堆（min heap）；反之，若母节点的值恒大于等于子节点的值，此堆称为最大堆（max heap）。在堆中最顶端的那一个节点，称作根节点（root node），根节点本身没有母节点（parent node）。

### 性质
堆的实现通过构造二叉堆（binary heap），实为二叉树的一种；

这种数据结构具有以下性质：

- 任意节点小于（或大于）它的所有后裔，最小元（或最大元）在堆的根上（堆序性）。
- 堆总是一棵完全树。即除了最底层，其他层的节点都被元素填满，且最底层尽可能地从左到右填入。
- 将根节点最大的堆叫做最大堆或大根堆，根节点最小的堆叫做最小堆或小根堆。

### 基本操作

操作|描述|时间复杂度
---|---|---
build|采用罗伯特·弗洛伊德提出的较快方式创建堆|O(n)
insert|向堆中插入一个新元素|O(log n)
update|将新元素提升使其符合堆的性质|O(log n)
get|获取当前堆顶元素的值|O(1)
delete|删除堆顶元素|O(log n)
heapify|使删除堆顶元素的堆再次成为堆|O(log n)


### 实现
用数组实现一个二叉堆，表示堆的数组A包含两个属性:
- A.length(通常)给出数组元素的个数
- A.heap-size表示有多少个堆元素在数组中

也就是说，虽然A[1...A.length]可能都存有数据，但只有A[1...A.heap-size]中存放的是堆的有效元素，满足：
0 <= A.heap-size <= A.length。

树的根节点是A[1], 给定一个节点下标i, 可得到父节点、左孩子、右孩子下标：
```
parent(i)
  return i/2

left(i)
  return 2i

right(i)
  return 2i + 1
```

- 未使用i = 0元素的数组的父子节点的下标关系:
  - parent = i -> left = 2i， right = 2i + 1
  - child = j -> parent = j / 2
- 使用i = 0元素的数组的父子节点的下标关系:
  - parent = i -> left = 2i + 1, right = 2(i + 1)
  - child = j -> parent = (j - 1) / 2


### 建堆
pseudocode实现一个最大堆
```
// 堆化(下沉)
maxHeapify(A, i)
  l = left(i)
  r = right(i)

  if l <= A.heap-size and A[l] > A[i]
    largest = l
  else
    largest = i

  if r <= A.heap-size and A[r] > A[largest]
    largest = r

  if largest != i
    exchange A[i] with A[largest]
    maxHeapify(A, largest)
```

```
// 建堆
buildMaxHeap(A)
  A.heap-size = A.length
  for i = [A.length/2] downto 1
    maxHeapify(A, i)
```

javascript版实现
```
var swap = (arr, i, j) => {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
};

var heapify = (arr, i, heapsize) => {
    var left = (i << 1) + 1,
        right = (i << 1) + 2,
        largest = i;

    if (left < heapsize && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < heapsize && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest !== i) {
        swap(arr, i, largest);
        heapify(arr, largest, heapsize);
    }
};

var buildMaxHeap = (arr) => {
    var len = arr.length;

    for (var i = (len >> 1); i >= 0; i--) {
        heapify(arr, i, len);
    }
};
```

### 优先队列
- 优先队列是一种用来维护一组元素构成的集合
- 其中每个元素都有一个相关的值，称为关键字，来确定各自优先级。
- 优先队列中的每个元素都有各自的优先级，优先级最高的元素最先得到服务；优先级相同的元素按照其在优先队列中的顺序得到服务。优先队列往往用堆来实现。

优先队列也分为最大优先队列和最小优先队列。

- 最大优先队列的应用：共享计算机系统的作业调度，记录将要执行的各个作业以及他们之间的相对优先级。
- 最小优先队列的应用：基于事件驱动模拟器。事件必须按照发生的时间顺序进行模拟，因为某一事件的模拟结果可能会触发对其他的事件的模拟


#### 初级实现
有许多简单低效的实现。如用一个有序的数组；或使用无序数组，在每次取出时搜索全集合，这种方法插入的效率为O(1)，但取出时效率为​O(n)。

#### 典型实现
出于性能考虑，优先队列用堆来实现，具有O(log n)时间复杂度的插入元素性能，O(n)的初始化构造的时间复杂度。如果使用自平衡二叉查找树，插入与删除的时间复杂度为O(log n)，构造二叉树的时间复杂度为O(n log n)。

从计算复杂度的角度，优先级队列等价于排序算法。

有一些特殊的堆为优先队列的实现提供了额外的性能：二叉堆的插入与提取操作的时间复杂度为O(log n)，并可以常量时间复杂度的peek操作。二项堆提供了几种额外操作。斐波那契堆的插入、提取、修改元素优先级等操作具有分摊常量时间复杂度，[1]，但删除操作的时间复杂度为O(log n)。Brodal queue具有最糟糕情况下的常量复杂度但算法相当复杂因而不具有实用性。

对于整型、浮点型等具有有限值域的元素的数据类型，优先队列有更快的实现。

#### 最大优先队列
- insert(S, x): 把元素x插入集合S
- maximum(S): 返回S中具有最大关键字的元素
- extractMax(S): 去掉并返回S中具有最大关键字的元素
- increaseKey(S, x, k): 将元素x的关键字增加到k, 假设k的值不小于x的原关键字值

pseudocode

```
// 获取最大关键字
maximum(A)
  return A[1]
```

```
// 去除现有最大
extractMax(A)
  if A.heap-size < 1
    error "heap underflow"
  
  max = A[1]
  A[1] = A[A.heap-size]
  A.heap-size = A.heap-size - 1
  maxHeapify(A, 1)
  return max
```

```
// 增加关键字（上浮）
increaseKey(S, i, k)
  if key < A[i]
    error "new key is smaller than current key"
  
  A[i] = key

  while i > 1 and A[parent[i]] < A[i]
    exchange A[i] with A[parent[i]]
    i = parent[i]
```

```
// 插入
insert(A, key)
  A.heap-size = A.heap-size + 1
  A[A.heap-size] = -∞
  increaseKey(A, A.heap-size, key)
```


## 题目实战
[数组中的第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)
