var a = {};

Object.defineProperty(a, 'a', {
  value: 1,
  writable: false, // 是否可重新赋值
  enumerable: false, // 是否可枚举, for...in 和 Object.keys
  configurable: false, // 是否可以被删除， 除了value和writeable意外的其他属性能否被修改
});

Object.defineProperty(a, Symbol.for('b'), {
  value: 'symbol b',
  writable: false, // 是否可重新赋值
  enumerable: false, // 是否可枚举, for...in 和 Object.keys
  configurable: false, // 是否可以被删除， 除了value和writeable意外的其他属性能否被修改
});

/**
 1.自身的可枚举属性
 2.继承的可枚举属性
 */
for (let key in a) {
  console.log('for...in', key);
}

/**
  Reflect.ownKeys =
    Object.getOwnPropertyNames(target)
    .concat(Object.getOwnPropertySymbols(target))
 */
Reflect.ownKeys(a).map(key => {
  console.log('Reflect.ownKeys', key, 'Symbol.keyFor', typeof key === 'symbol' ? Symbol.keyFor(key) : '');
});

/**
  1.获取自身所有属性名(包括不可枚举属性)
  2.不包含Symbol值做名称的属性
 */
Object.getOwnPropertyNames(a).map(key => {
  console.log('Object.getOwnPropertyNames', key);
});

/**
 获取自身所有Symbol属性的数组
 */
Object.getOwnPropertySymbols(a).map(key => {
  console.log('Object.getOwnPropertySymbols', key);
});

console.log('Object.getOwnPropertyDescriptor', Object.getOwnPropertyDescriptor(a, 'a'));
console.log('Object.getOwnPropertyDescriptors', Object.getOwnPropertyDescriptors(a));
// console.log('a', a);