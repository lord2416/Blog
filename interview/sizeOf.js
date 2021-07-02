var SIZE = {
  STRING: 2,
  BOOLEAN: 4,
  NUMBER: 8,
};

// function sizeOfObject(obj) {
//   const keys = Reflect.ownKeys(obj);
//   let res = 0;

//   for (let i = 0, len = keys.length; i < len; i++) {
//     res += sizeOf(keys[i]);

//     try {
//       res += sizeOf(obj[keys[i]]);
//     } catch (e) {
//       if (e instanceof RangeError) {
//         res = 0;
//       }
//     }
//   }

//   return res;
// }

// function sizeOf(obj) {
//   const type = typeof(obj);

//   switch (type) {
//     case 'string':
//       return obj.length * SIZE.STRING;
//     case 'number':
//       return SIZE.NUMBER;
//     case 'boolean':
//       return SIZE.BOOLEAN;
//     case 'symbol':
//       const isGlogalSymbol = Symbol.keyFor && Symbol.keyFor(obj);

//       return isGlogalSymbol
//         ? Symbol.keyFor(obj).length * SIZE.STRING
//         : (obj.toString().length - 8) * SIZE.STRING;

//     case 'object':
//       if (Array.isArray(obj)) {
//         return obj.reduce((acc, cur) => {
//           acc += sizeOf(cur);
//           return acc;
//         }, 0);
//       } else {
//         return sizeOfObject(obj);
//       }
//     default:
//       return 0;
//   }
// }

function sizeOfObject(set, obj) {
  if (!obj) {
    return 0;
  }

  let bytes = 0;
  const keys = Reflect.ownKeys(obj);

  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i];

    bytes += calculator(set)(key);

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (set.has(obj[key])) {
        continue;
      }
      set.add(obj[key]);
    }

    try {
      bytes += calculator(set)(obj[key]);
    } catch (e) {
      if (e instanceof RangeError) {
        bytes = 0;
      }
    }
  }

  return bytes;
}

function calculator(set) {
  return function (obj) {
    const type = typeof obj;

    switch (type) {
      case 'string':
        return obj.length * SIZE.STRING;
      case 'boolean':
        return SIZE.BOOLEAN;
      case 'number':
        return SIZE.NUMBER;
      case 'symbol':
        const isGlobalSymbol = Symbol.keyFor && Symbol.keyFor(obj);

        return isGlobalSymbol
          ? Symbol.keyFor(obj).length * SIZE.STRING
          : (obj.toString().length - 8) * SIZE.STRING;
      case 'object':
          if (Array.isArray(obj)) {
            return obj.map(calculator(set)).reduce((acc, cur) => {
              return acc + cur;
            }, 0);
          } else {
            return sizeOfObject(set, obj);
          }
      default:
        return 0;
    }
  }
}

function sizeOf(obj) {
  return calculator(new WeakSet())(obj);
}

var a = {
  a: '1',
  b: '2',
  c: [1,2],
};

var s1 = sizeOf({
  a,
  b: true,
  c: a,
});

console.log(s1);