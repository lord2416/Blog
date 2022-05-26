// 洗牌
const shuffle = (arr) => {
  if (!arr || !arr.length) {
    return arr;
  }

  const swap = (arr, i, j) => {
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp; 
  };

  const len = arr.length;

  for (let i = 0; i < len - 1; i++) {
    let j = Math.floor(Math.random()*((len - 1) - (i + 1) + 1)) + i + 1;
    swap(arr, i, j);
  }

  return arr;
};

// var shuffle = (arr = []) => {
//   var len = arr.length;

//   var swap = (arr, a, b) => {
//       var temp = arr[a];
//       arr[a] = arr[b];
//       arr[b] = temp;
//   };

//   for (var i = len - 1; i > 0; i--) {
//       var random = Math.floor(Math.random() * (len - i));
//       console.log('random', random, i);
//       swap(arr, random, i);
//   }

//   console.log('arr', arr);

//   return arr;
// };