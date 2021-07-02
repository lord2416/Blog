// const curry = function (fn, ...outerArgs) {
//   return function(...innerArgs) {
//     const args = outerArgs.concat(innerArgs);

//     if (fn.length === args.length) {
//       return fn.apply(null, args);
//     }

//     return curry(fn, args);
//   }
// };

const curry = (fn) => {
  const len = fn.length;
  return function $curry(...args) {
    if (args.length < len) {
      return $curry.bind(null, ...args);
      // return function (...args2) {
      //   return $curry.apply(null, args.concat(args2));
      // }
    }

    return fn.call(null, ...args);
  }
};

const sum = () => {
  return args.reduce((a, b) => a + b, 0);
};

// sum(1);
// sum(1)(2)(3);
const cSum = curry((a, b) => {
  return a + b;
});

const res1 = cSum(1)(3);
console.log('res1', res1);
const res2 = cSum(1, 2);
console.log('res2', res2);
