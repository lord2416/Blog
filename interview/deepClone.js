const obj = {
  [Symbol('a')]: 'symbol a',
  [Symbol('b')]: 'symbol b',
  [Symbol('c')]: {
    c1: 'c1',
    c2: 'c2',
    c3: 'c3',
  },
};

const arr = [
  1,
  obj,
  {
    date: new Date(),
  },
  [1, 2, 3],
  [
    { a: 1 },
    { b: 2 },
    { c: 3 },
    4,
    new Boolean(true),
    Symbol('a'),
    Symbol.for('b'),
    function () {
      console.log('a');
    }
  ]
];

const TYPE = {
  object: '[object Object]',
  array: '[object Array]',
  date: '[object Date]',
};

const deepClone = (source) => {
  const target = Array.isArray(source) ? [] : {};

  Reflect.ownKeys(source).map(key => {
    const type = Object.prototype.toString.call(source[key]);

    switch (type) {
      case TYPE.object:
        target[key] = deepClone(source[key]);
        break;
      case TYPE.array:
        target[key] = deepClone(source[key]);
        break;
      // case TYPE.date:
      //   target[key] = new Date(+source[key]);
      //   break;
      default:
        target[key] = source[key];
        break;
    }
  });

  return target;
};


console.log('arr', arr);
const res = deepClone(arr);
console.log('res', res);