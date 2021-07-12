function findKthLargest(arr, k) {
  const swap = (arr, i, j) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  };

  const partition = (arr, left, right) => {
    if (right > left) {
      const ranIndex = Math.floor(Math.random() * (right - left + 1)) + left;
      swap(arr, left, ranIndex);
    }

    const pivot = arr[left];
    const len = arr.length;
    let l = left + 1;

    for (let i = left + 1; i < len; i++) {
      if (arr[i] > pivot) {
        swap(arr, i, l++);
      }
    }

    swap(arr, left, l - 1);

    // console.log('arr', arr, 'pivot', pivot);

    return l - 1;
  };

  const find = (arr, k) => {
    const len = arr.length;
    let left = 0;
    let right = len - 1;

    while (true) {
      let index = partition(arr, left, right);

      if (index === k) {
        return arr[index];
      } else if (index < k) {
        left = index + 1;
      } else {
        right = index - 1;
      }
    }
  };

  return find(arr, k - 1);
}


// var ran = Math.random();
// var arr = [19,31,23,2,1,5,6,4,18];
var arr = [9,3,8,2,7,1,6,4,5]
var res = findKthLargest(arr, 3);
console.log('res', res);