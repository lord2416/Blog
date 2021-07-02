var STATUS = {
  PENDING: 'pending',
  REJECT: 'rejected',
  FULFILLED: 'fulfilled'
};

class MyPromise {
  constructor(fn) {
      try {
         fn(this.resolve, this.reject);
      } catch (e) {
         this.reject(e); 
      }
  };

  status = STATUS.PENDING;

  value = null;

  reason = null;

  onFulfilledCallbacks = [];

  onRejectedCallbacks = [];

  resolve = (value) => {
      if (this.status === STATUS.PENDING) {
          this.status = STATUS.FULFILLED;
          this.value = value;

          while (this.onFulfilledCallbacks.length) {
//                 this.onFulfilledCallbacks.shift()(value);
              const fn = this.onFulfilledCallbacks.shift();
              console.log('resolve fn', fn);
              fn(value);
          }
      }
  };

  reject = (reason) => {
      if (this.status === STATUS.PENDING) {
          this.status = STATUS.REJECT;
          this.reason = reason;

          while (this.onRejectedCallbacks.length) {
//                 this.onRejectedCallbacks.shift()(value);
              const fn = this.onRejectedCallbacks.shift();
              console.log('reject fn', fn);
              fn(reason);
          }
      }
  };

  then(onFulfilled, onRejected) {
      const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
      const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
      const self = this;

      const promise2 = new MyPromise((resolve, reject) => {
          const fulfilledMicroTask = () => {
              queueMicrotask(() => {
                  try {
                      const x = realOnFulfilled(this.value);
                      // resolvePromise(promise2, x, resolve, reject);
                      if (x instanceof MyPromise) {
                        x.then(resolve, reject);
                      } else {
                        resolve(x);
                      }
                  } catch (e) {
                      reject(e);
                  }
              });
          };
          const rejectedMicroTask = () => {
              queueMicrotask(() => {
                  try {
                      const x = realOnRejected(this.reason);
                      // resolvePromise(promise2, x, resolve, reject);
                      if (x instanceof MyPromise) {
                        x.then(resolve, reject);
                      } else {
                        reject(x);
                      }
                  } catch (e) {
                      reject(e);
                  }
              });
          };

          if (this.status === STATUS.FULFILLED) {
              fulfilledMicroTask();
          } else if (this.status === STATUS.REJECT) {
              rejectedMicroTask();
          } else if (this.status === STATUS.PENDING) {
              self.onFulfilledCallbacks.push(fulfilledMicroTask);
              self.onRejectedCallbacks.push(rejectedMicroTask);
          }
      });

      return promise2;
  }
}

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
      return reject(new TypeError('promise and return value are same'));
  }

  if (x instanceof MyPromise) {
      x.then(resolve, reject);
  } else {
      resolve(x);
  }
};


var p  = new MyPromise((resolve) => {
  console.log('1');
//     return 1;
  setTimeout(() => {
    resolve();
  }, 1000);
});

// console.log(p);
p.then(() => {
  console.log('2');
});