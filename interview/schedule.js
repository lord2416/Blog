var arr = [
  {
      time: 1000,
      url: '1',
  },
  {
      time: 500,
      url: '2',
  },
  {
      time: 300,
      url: '3',
  },
      {
      time: 400,
      url: '4',
  },
];

// var sendRequest = (arr, max) => {
//   var delay = (data) => {
//       return new Promise((resolve) => {
//           console.log('开始', data.url);
//           setTimeout(() => {
//               console.log('结束', data.url);
//               resolve();
//           }, data.time);
//       });
//   };


//   var enqueue = (arr, max) => {
//       var queue = [...arr];
//       var promises = queue.splice(0, max).map((item, index) => {
//           return delay(item).then(() => {
//               return index;
//           });
//       });

//       var run = Promise.race(promises);

//       for (let i = 0; i < queue.length; i++) {
//           run = run.then(index => {
//               promises[index] = delay(queue[i]).then(() => {
//                   if (i === queue.length - 1) {
//                      console.log('全部结束finished');
//                   }
//                   return index;
//               })
//               console.log('promises', promises);
//               return Promise.race(promises);
//           })
//       }
//   };

//   enqueue(arr, max);
// };


// sendRequest(arr, 2);

// class Schedule {
//   constructor(count) {
//     this.count = count;
//     this.tasks = [];
//   }
//   addTask(task) {
//     this.tasks.push(task);
//   }
//   run() {
//     const tasks = [...this.tasks];
//     const queue = tasks.splice(0, this.count).map((task, index) => {
//       return task().then(() => {
//         return index;
//       });
//     })

//     let p = Promise.race(queue);

//     for (let i = 0; i < tasks.length; i++) {
//       p = p.then(index => {
//         // console.log('index', index);
//         queue[index] = tasks[i]().then(() => {
//           return index;
//         })

//         return Promise.race(queue);
//       });
//     }
//   }
// }

// var s = new Schedule(2);
// var timeout = (time, order) => () => {
//   return new Promise((resolve) => {
//     // console.log('order开始', order);
//     setTimeout(() => {
//       console.log('order结束', order);
//       resolve();
//     }, time);
//   });
// };

// var addTask = (time, order) => {
//   s.addTask(timeout(time, order));
// };

// addTask(1000, '1');
// addTask(500, '2');
// addTask(300, '3');
// addTask(400, '4');
// s.run();

class Schedule {
  constructor(count) {
    this.count = count;
    this.tasks = [];
    this.queue = [];
  }
  addTask(task) {
    return new Promise((resolve) => {
      this.tasks.push(task);
      this.run(resolve);
    });
  }
  run(resolve) {
    const tasks = [...this.tasks];

    this.queue = tasks.splice(0, this.count).map((task, index) => {
      return task().then(() => {
        // console.log('index', index);
        resolve();
        return index;
      });
    });

    let p = Promise.race(this.queue);
  
    for (let i = 0, len = tasks.length; i < len; i++) {
      p = p.then((index) => {
        this.queue[index] = tasks[i]().then(() => {
          resolve();

          return index;
        });

        return Promise.race(this.queue);
      });
    }
  }
}

var s = new Schedule(2);
var timeout = (time) => ()  => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

var addTask = (time, order) => {
  s.addTask(timeout(time)).then(() => {
    console.log(order);
  });
};

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');
