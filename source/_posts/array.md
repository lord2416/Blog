# Array
## 描述
用于构造数组的全局对象，数组是类似于列表的高阶对象。

只能用整数作为数组元素的索引，而不能用字符串。后者称为 关联数组。使用非整数并通过 方括号 或 点号 来访问或设置数组元素时，所操作的并不是数组列表中的元素，而是数组对象的 属性集合 上的变量。数组对象的属性和数组元素列表是分开存储的，并且数组的遍历和修改操作也不能作用于这些命名属性。

```
let arr = [1,2];

// Object.defineProperty(arr, 'a', {
//  value : 1,
//  enumerable: true,
//  writable: true,
// });


// for (let key in arr) {
//     console.log('in', key, arr[key]);
// }

for (let key of arr) {
    console.log('of', key, arr[key]);
}
```

## length
length 是Array的实例属性。返回或设置一个数组中的元素个数。该值是一个无符号 32-bit 整数，并且总是大于数组最高项的下标。

[length](https://262.ecma-international.org/6.0/#sec-properties-of-array-instances-length)

范围:
0 到 2**32 - 1

```
// right
let arr = new Array(2**32 - 1);

// Uncaught RangeError: Invalid array length
let arr = new Array(2**53 - 1);
```

先思考几个问题:
- 数组的构造器有哪几种？
- 哪些是改变自身的方法？
- 哪些是不改变自身的方法？
- 遍历的方法有哪些？

## 数组概念的探究
截至 ES7 规范，数组共包含 33 个标准的 API 方法和一个非标准的 API 方法，使用场景和使用方案纷繁复杂，其中还有不少坑。

### Array 的构造器
Array 构造器用于创建一个新的数组。通常，我们推荐使用对象字面量的方式创建一个数组，例如 var a = [] 就是一个比较好的写法。但是，总有对象字面量表述乏力的时候，比如，我想创建一个长度为 6 的空数组，用对象字面量的方式是无法创建的，因此只能写成下述代码这样。

```
// 使用 Array 构造器，可以自定义长度
var a = Array(6); // [empty × 6]
// 使用对象字面量
var b = [];
b.length = 6; // [undefined × 6]
```
Array 构造器根据参数长度的不同，有如下两种不同的处理方式：

new Array(arg1, arg2,…)，参数长度为 0 或长度大于等于 2 时，传入的参数将按照顺序依次成为新数组的第 0 至第 N 项（参数长度为 0 时，返回空数组）；

new Array(len)，当 len 不是数值时，处理同上，返回一个只包含 len 元素一项的数组；当 len 为数值时，len 最大不能超过 32 位无符号整型，即需要小于 2 的 32 次方（len 最大为 Math.pow(2,32)），否则将抛出 RangeError。

以上就是 Array 构造器的基本情况，我们来看下 ES6 新增的几个构造方法。

### ES6 新增的构造方法：Array.of 和 Array.from
鉴于数组的常用性，ES6 专门扩展了数组构造器 Array ，新增了 2 个方法：Array.of、Array.from。

#### Array.of

Array.of 用于将参数依次转化为数组中的一项，然后返回这个新数组，而不管这个参数是数字还是其他。它基本上与 Array 构造器功能一致，唯一的区别就在单个数字参数的处理上。

比如，在下面的这几行代码中，你可以看到区别：当参数为两个时，返回的结果是一致的；当参数是一个时，Array.of 会把参数变成数组里的一项，而构造器则会生成长度和第一个参数相同的空数组。

```
Array.of(8.0); // [8]
Array(8.0); // [empty × 8]
Array.of(8.0, 5); // [8, 5]
Array(8.0, 5); // [8, 5]
Array.of('8'); // ["8"]
Array('8'); // ["8"]
```

#### Array.from

Array.from 的设计初衷是快速便捷地基于其他对象创建新数组，准确来说就是从一个类似数组的可迭代对象中创建一个新的数组实例。其实就是，只要一个对象有迭代器，Array.from 就能把它变成一个数组（注意：是返回新的数组，不改变原对象）。

从语法上看，Array.from 拥有 3 个参数：

- 类似数组的对象，必选；
- 加工函数，新生成的数组会经过该函数的加工再返回；
- this 作用域，表示加工函数执行时 this 的值。

这三个参数里面第一个参数是必选的，后两个参数都是可选的。我们通过一段代码来看看它的用法。

```
var obj = {0: 'a', 1: 'b', 2:'c', length: 3};
Array.from(obj, function(value, index){
  console.log(value, index, this, arguments.length);
  return value.repeat(3);   //必须指定返回值，否则返回 undefined
}, obj);

// 
```

这表明了通过 Array.from 这个方法可以自己定义加工函数的处理方式，从而返回想要得到的值；如果不确定返回值，则会返回 undefined，最终生成的也是一个包含若干个 undefined 元素的空数组。

实际上，如果这里不指定 this 的话，加工函数完全可以是一个箭头函数。上述代码可以简写为如下形式。

```
Array.from(obj, (value) => value.repeat(3));
//  控制台返回 (3) ["aaa", "bbb", "ccc"]
```

除了上述 obj 对象以外，拥有迭代器的对象还包括 String、Set、Map 等，Array.from 统统可以处理，请看下面的代码。

```
// String
Array.from('abc');         // ["a", "b", "c"]
// Set
Array.from(new Set(['abc', 'def'])); // ["abc", "def"]
// Map
Array.from(new Map([[1, 'ab'], [2, 'de']])); 
// [[1, 'ab'], [2, 'de']]
```


### Array 的判断

Array.isArray 用来判断一个变量是否为数组类型。

在 ES5 提供该方法之前，我们至少有如下 5 种方式去判断一个变量是否为数组。

```
var a = [];
// 1.基于instanceof
a instanceof Array;
// 2.基于constructor
a.constructor === Array;
// 3.基于Object.prototype.isPrototypeOf
Array.prototype.isPrototypeOf(a);
// 4.基于getPrototypeOf
Object.getPrototypeOf(a) === Array.prototype;
// 5.基于Object.prototype.toString
Object.prototype.toString.apply(a) === '[object Array]';
```

ES6 之后新增了一个 Array.isArray 方法，能直接判断数据类型是否为数组，但是如果 isArray 不存在，那么 Array.isArray 的 polyfill 通常可以这样写：

```
if (!Array.isArray){
  Array.isArray = function(arg){
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
```

### 改变自身的方法
基于 ES6，会改变自身值的方法一共有 9 个，分别为 pop、push、reverse、shift、sort、splice、unshift，以及两个 ES6 新增的方法 copyWithin 和 fill。

```
// pop方法
var array = ["cat", "dog", "cow", "chicken", "mouse"];
var item = array.pop();
console.log(array); // ["cat", "dog", "cow", "chicken"]
console.log(item); // mouse
// push方法
var array = ["football", "basketball",  "badminton"];
var i = array.push("golfball");
console.log(array); 
// ["football", "basketball", "badminton", "golfball"]
console.log(i); // 4
// reverse方法
var array = [1,2,3,4,5];
var array2 = array.reverse();
console.log(array); // [5,4,3,2,1]
console.log(array2===array); // true
// shift方法
var array = [1,2,3,4,5];
var item = array.shift();
console.log(array); // [2,3,4,5]
console.log(item); // 1
// unshift方法
var array = ["red", "green", "blue"];
var length = array.unshift("yellow");
console.log(array); // ["yellow", "red", "green", "blue"]
console.log(length); // 4
// sort方法
var array = ["apple","Boy","Cat","dog"];
var array2 = array.sort();
console.log(array); // ["Boy", "Cat", "apple", "dog"]
console.log(array2 == array); // true
// splice方法
var array = ["apple","boy"];
var splices = array.splice(1,1);
console.log(array); // ["apple"]
console.log(splices); // ["boy"]
// copyWithin方法
var array = [1,2,3,4,5]; 
var array2 = array.copyWithin(0,3);
console.log(array===array2,array2);  // true [4, 5, 3, 4, 5]
// fill方法
var array = [1,2,3,4,5];
var array2 = array.fill(10,0,3);
console.log(array===array2,array2); 
// true [10, 10, 10, 4, 5], 可见数组区间[0,3]的元素全部替换为10
```

 Leetcode 中的第 88 题 《合并两个有序数组》：
```
给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。
输入:
nums1 = [1,2,3,0,0,0]； m = 3
nums2 = [2,5,6]；       n = 3
输出: [1,2,2,3,5,6]
你可以仔细看下题目要求：

首先是将 nums2 合并到 nums1 里面，不新开数组，否则将无法通过；

其次是合并完了之后 nums1 还是一个有序数组，这里也是需要注意的；

另外样例里面 nums1 和 nums2 都有“2”这个数，也都需要将重复的合并进去。

我们看上面这三点，可以思考下，既然要求不能新开数组，那么就需要利用数组改变自身的方法完成这个题目，应该怎么做呢？你可以试着先将想法写下来，之后再来看我提供的答案。

答案就是巧妙地利用数组的 API 中的 splice、push、sort 这三个方法，在原数组上进行操作，最终完成如下代码：

// 非最优解
var merge = function(nums1, m, nums2, n) {
    nums1.splice(m);
    nums2.splice(n);
    nums1.push(...nums2);
    nums1.sort((a,b) => a - b);  // nums1从小到大排列，所以是a-b
};
```

### 不改变自身的方法
基于 ES7，不会改变自身的方法也有 9 个，分别为 concat、join、slice、toString、toLocaleString、indexOf、lastIndexOf、未形成标准的 toSource，以及 ES7 新增的方法 includes。

```
// concat方法
var array = [1, 2, 3];
var array2 = array.concat(4,[5,6],[7,8,9]);
console.log(array2); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(array); // [1, 2, 3], 可见原数组并未被修改
// join方法
var array = ['We', 'are', 'Chinese'];
console.log(array.join()); // "We,are,Chinese"
console.log(array.join('+')); // "We+are+Chinese"
// slice方法
var array = ["one", "two", "three","four", "five"];
console.log(array.slice()); // ["one", "two", "three","four", "five"]
console.log(array.slice(2,3)); // ["three"]
// toString方法
var array = ['Jan', 'Feb', 'Mar', 'Apr'];
var str = array.toString();
console.log(str); // Jan,Feb,Mar,Apr
// tolocalString方法
var array= [{name:'zz'}, 123, "abc", new Date()];
var str = array.toLocaleString();
console.log(str); // [object Object],123,abc,2016/1/5 下午1:06:23
// indexOf方法
var array = ['abc', 'def', 'ghi','123'];
console.log(array.indexOf('def')); // 1
// includes方法
var array = [-0, 1, 2];
console.log(array.includes(+0)); // true
console.log(array.includes(1)); // true
var array = [NaN];
console.log(array.includes(NaN)); // true
```

1.includes 方法需要注意的是，如果元素中有 0，那么在判断过程中不论是 +0 还是 -0 都会判断为 True，这里的 includes 忽略了 +0 和 -0。

2.另外还有一个值得强调的是slice 不改变自身，而 splice 会改变自身。其中，slice 的语法是：arr.slice([start[, end]])，而 splice 的语法是：arr.splice(start,deleteCount[, item1[, item2[, …]]])。我们可以看到从第二个参数开始，二者就已经有区别了，splice 第二个参数是删除的个数，而 slice 的第二个参数是 end 的坐标（可选）。

3.lastIndexOf 和 indexOf 基本功能差不多，不过 lastIndexOf 是从后面寻找元素的下标；而 toSource 方法还未形成标准，因此在这里不做过多介绍了。

### 数组遍历的方法
基于 ES6，不会改变自身的遍历方法一共有 12 个，分别为 forEach、every、some、filter、map、reduce、reduceRight，以及 ES6 新增的方法 entries、find、findIndex、keys、values。


```
// forEach方法
var array = [1, 3, 5];
var obj = {name:'cc'};
var sReturn = array.forEach(function(value, index, array){
  array[index] = value;
  console.log(this.name); // cc被打印了三次, this指向obj
},obj);
console.log(array); // [1, 3, 5]
console.log(sReturn); // undefined, 可见返回值为undefined
// every方法
var o = {0:10, 1:8, 2:25, length:3};
var bool = Array.prototype.every.call(o,function(value, index, obj){
  return value >= 8;
},o);
console.log(bool); // true
// some方法
var array = [18, 9, 10, 35, 80];
var isExist = array.some(function(value, index, array){
  return value > 20;
});
console.log(isExist); // true 
// map 方法
var array = [18, 9, 10, 35, 80];
array.map(item => item + 1);
console.log(array);  // [19, 10, 11, 36, 81]
// filter 方法
var array = [18, 9, 10, 35, 80];
var array2 = array.filter(function(value, index, array){
  return value > 20;
});
console.log(array2); // [35, 80]
// reduce方法
var array = [1, 2, 3, 4];
var s = array.reduce(function(previousValue, value, index, array){
  return previousValue * value;
},1);
console.log(s); // 24
// ES6写法更加简洁
array.reduce((p, v) => p * v); // 24
// reduceRight方法 (和reduce的区别就是从后往前累计)
var array = [1, 2, 3, 4];
array.reduceRight((p, v) => p * v); // 24
// entries方法
var array = ["a", "b", "c"];
var iterator = array.entries();
console.log(iterator.next().value); // [0, "a"]
console.log(iterator.next().value); // [1, "b"]
console.log(iterator.next().value); // [2, "c"]
console.log(iterator.next().value); // undefined, 迭代器处于数组末尾时, 再迭代就会返回undefined
// find & findIndex方法
var array = [1, 3, 5, 7, 8, 9, 10];
function f(value, index, array){
  return value%2==0;     // 返回偶数
}
function f2(value, index, array){
  return value > 20;     // 返回大于20的数
}
console.log(array.find(f)); // 8
console.log(array.find(f2)); // undefined
console.log(array.findIndex(f)); // 4
console.log(array.findIndex(f2)); // -1
// keys方法
[...Array(10).keys()];     // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
[...new Array(10).keys()]; // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
// values方法
var array = ["abc", "xyz"];
var iterator = array.values();
console.log(iterator.next().value);//abc
console.log(iterator.next().value);//xyz
```

1.要注意有些遍历方法不会返回处理之后的数组，比如 forEach；有些方法会返回处理之后的数组，比如 filter。这个细节你需要牢记，这样才会在面试过程中正确作答。

2.reduce 方法也需要重点关注，其参数复杂且多，通常一些复杂的逻辑处理，其实使用 reduce 很容易就可以解决。我们重点看一下，reduce 到底能解决什么问题呢？先看下 reduce 的两个参数。

- 首先是 callback（一个在数组的每一项中调用的函数，接受四个参数）：
 - previousValue（上一次调用回调函数时的返回值，或者初始值）

 - currentValue（当前正在处理的数组元素）

 - currentIndex（当前正在处理的数组元素下标）

 - array（调用 reduce() 方法的数组）

- 然后是 initialValue（可选的初始值，作为第一次调用回调函数时传给 previousValue 的值）。


```
/* 题目：数组 arr = [1,2,3,4] 求数组的和：*/
// 第一种方法：
var arr = [1,2,3,4];
var sum = 0;
arr.forEach(function(e){sum += e;}); // sum = 10
// 第二种方法
var arr = [1,2,3,4];
var sum = 0;
arr.map(function(obj){sum += obj});
// 第三种方法
var arr = [1,2,3,4];
arr.reduce(function(pre,cur){return pre + cur});
```
从上面代码可以看出，我们分别用了 forEach 和 map 都能实现数组的求和，其中需要另外新定义一个变量 sum，再进行累加求和，最后再来看 sum 的值，而 reduce 不仅可以少定义一个变量，而且也会直接返回最后累加的结果，问题就可以轻松解决了


那么我们结合一道题目来看看 reduce 怎么用。

题目： var arr = [ {name: 'brick1'}, {name: 'brick2'}, {name: 'brick3'} ]

希望最后返回到 arr 里面每个对象的 name 拼接数据为 'brick1, brick2 & brick3' ，如果用 reduce 如何实现呢？

```
var arr =  [ {name: 'one'}, {name: 'two'}, {name: 'three'} ];
arr.reduce(function(prev, current, index, array){
  if (index === 0){
    return current.name;
  } else if (index === array.length - 1){
    return prev + ' & ' + current.name;
  } else {
    return prev + ', ' + current.name;
  }
}, '');
// 返回结果 "one, two & three"
```

### 看看ES6底层

#### push
为了更好地实现 push 的底层方法，可以先去 ECMA 的官网去查一下关于 push 的基本描述（链接：[ECMA 数组的 push 标准](https://262.ecma-international.org/6.0/#sec-array.prototype.push)），我们看下其英文的描述，如下所示。

```
When the push method is called with zero or more arguments, the following steps are taken:
1. Let O be ? ToObject(this value).
2. Let len be ? LengthOfArrayLike(O).
3. Let argCount be the number of elements in items.
4. If len + argCount > 2^53 - 1, throw a TypeError exception.
5. For each element E of items, do
  a. Perform ? Set(O, ! ToString(F(len)), E, true).
  b. Set len to len + 1.
6. Perform ? Set(O, "length", F(len), true).
7. Return F(len).
```
从上面的描述可以看到边界判断逻辑以及实现的思路，根据这段英文，我们将其转换为容易理解代码，如下所示。

```
Array.prototype.push = function(...items) {
  let O = Object(this);  // ecma 中提到的先转换为对象
  let len = this.length >>> 0;
  let argCount = items.length >>> 0;
  // 2 ^ 53 - 1 为JS能表示的最大正整数
  if (len + argCount > 2 ** 53 - 1) {
    throw new TypeError("The number of array is over the max value")
  }
  for(let i = 0; i < argCount; i++) {
    O[len + i] = items[i];
  }
  let newLength = len + argCount;
  O.length = newLength;
  return newLength;
}
```

从上面的代码可以看出，关键点就在于给数组本身循环添加新的元素 item，然后调整数组的长度 length 为最新的长度，即可完成 push 的底层实现。

其中关于长度的部分需要做无符号位移，无符号位移在很多源码中你都会看到。关于为什么一些变量要进行无符号位移，你可以自己研究一下，比如在 Stack Overflow 中有一些高票的回答，这里就不占用篇幅了。下面我们再看来一下 pop 的实现。


#### pop
同样我们也一起来看下 pop 的底层实现，也可以先去 ECMA 的官网去查一下关于 pop 的基本描述（链接：ECMA 数组的 pop 标准），我们还是同样看下英文的描述。

```
When the pop method is called, the following steps are taken:
1. Let O be ? ToObject(this value).
2. Let len be ? LengthOfArrayLike(O).
3. If len = 0, then
    Perform ? Set(O, "length", +0F, true).
    Return undefined.
4. Else,
  Assert: len > 0.
  Let newLen be F(len - 1).
  Let index be ! ToString(newLen).
  Let element be ? Get(O, index).
  Perform ? DeletePropertyOrThrow(O, index).
  Perform ? Set(O, "length", newLen, true).
  Return element.
```

从上面的描述可以看到边界判断逻辑以及实现的思路，根据上面的英文，我们同样将其转换为可以理解的代码，如下所示。

```
Array.prototype.pop = function() {
  let O = Object(this);
  let len = this.length >>> 0;
  if (len === 0) {
    O.length = 0;
    return undefined;
  }
  len --;
  let value = O[len];
  delete O[len];
  O.length = len;
  return value;
}
```

其核心思路还是在于删掉数组自身的最后一个元素，index 就是数组的 len 长度，然后更新最新的长度，最后返回的元素的值，即可达到想要的效果。另外就是在当长度为 0 的时候，如果执行 pop 操作，返回的是 undefined，需要做一下特殊处理。

看完了 pop 的实现，我们再来看一下 map 方法的底层逻辑。

#### map
map 方法的底层实现
ECMA 的官网去查一下关于 map 的基本描述（链接：ECMA 数组的 map 标准），请看英文的表述。

```
When the map method is called with one or two arguments, the following steps are taken:
1. Let O be ? ToObject(this value).
2. Let len be ? LengthOfArrayLike(O).
3. If IsCallable(callbackfn) is false, throw a TypeError exception.
4. Let A be ? ArraySpeciesCreate(O, len).
5. Let k be 0.
6. Repeat, while k < len,
    a. Let Pk be ! ToString(F(k)).
    b. Let kPresent be ? HasProperty(O, Pk).
    c. If kPresent is true, then
        Let kValue be ? Get(O, Pk).
        Let mappedValue be ? Call(callbackfn, thisArg, « kValue, F(k), O »).
        Perform ? CreateDataPropertyOrThrow(A, Pk, mappedValue).
    d. Set k to k + 1.
7. Return A.
```

同样的，根据上面的英文，我们将其转换为可理解的代码，如下所示。

```
Array.prototype.map = function(callbackFn, thisArg) {
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'map' of null");
  }
  if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + ' is not a function')
  }
  let O = Object(this);
  let T = thisArg;

  let len = O.length >>> 0;
  let A = new Array(len);
  for(let k = 0; k < len; k++) {
    if (k in O) {
      let kValue = O[k];
      // 依次传入this, 当前项，当前索引，整个数组
      let mappedValue = callbackfn.call(T, KValue, k, O);
      A[k] = mappedValue;
    }
  }
  return A;
}
```

有了上面实现 push 和 pop 的基础思路，map 的实现也不会太难了，基本就是再多加一些判断，循环遍历实现 map 的思路，将处理过后的 mappedValue 赋给一个新定义的数组 A，最后返回这个新数组 A，并不改变原数组的值。


#### reduce

reduce 方法的底层实现
ECMA 官网关于 reduce 的基本描述（链接：ECMA 数组的 pop 标准），如下所示。

```
When the reduce method is called with one or two arguments, the following steps are taken:
1. Let O be ? ToObject(this value).
2. Let len be ? LengthOfArrayLike(O).
3. If IsCallable(callbackfn) is false, throw a TypeError exception.
4. If len = 0 and initialValue is not present, throw a TypeError exception.
5. Let k be 0.
6. Let accumulator be undefined.
7. If initialValue is present, then
    Set accumulator to initialValue.
8. Else,
    Let kPresent be false.
    Repeat, while kPresent is false and k < len,
        Let Pk be ! ToString(F(k)).
        Set kPresent to ? HasProperty(O, Pk).
        If kPresent is true, then
        Set accumulator to ? Get(O, Pk).
        Set k to k + 1.
    If kPresent is false, throw a TypeError exception.
9. Repeat, while k < len,
    Let Pk be ! ToString(F(k)).
    Let kPresent be ? HasProperty(O, Pk).
    If kPresent is true, then
        Let kValue be ? Get(O, Pk).
        Set accumulator to ? Call(callbackfn, undefined, « accumulator, kValue, F(k), O »).
    Set k to k + 1.
10. Return accumulator.
```

还是将其转换为我们自己的代码，如下所示。

```
Array.prototype.reduce  = function(callbackfn, initialValue) {
  // 异常处理，和 map 类似
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'reduce' of null");
  }
  // 处理回调类型异常
  if (Object.prototype.toString.call(callbackfn) != "[object Function]") {
    throw new TypeError(callbackfn + ' is not a function')
  }
  let O = Object(this);
  let len = O.length >>> 0;
  let k = 0;
  let accumulator = initialValue;  // reduce方法第二个参数作为累加器的初始值
  if (accumulator === undefined) {  
      throw new Error('Each element of the array is empty');
      // 初始值不传的处理
    for(; k < len ; k++) {
      if (k in O) {
        accumulator = O[k];
        k++;
        break;
      }
    }
  }
  for(;k < len; k++) {
    if (k in O) {
      // 注意 reduce 的核心累加器
      accumulator = callbackfn.call(undefined, accumulator, O[k], O);
    }
  }
  return accumulator;
}
```