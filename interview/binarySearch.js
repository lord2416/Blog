/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */

// 二分查左边界
// var lowBound = function(nums, target) {
//   var len = nums.length,
//      left = 0,
//      right = len;

//   while (left < right) {
//     var mid = left + ((right - left) >> 1);

//     if (nums[mid] < target) {
//       left = mid + 1;
//     } else {
//       right = mid;
//     }
//   }

//   console.log('left', left);
//  return left;
// };

var lowBound = function (nums, target) {
  var len = nums.length,
     left = 0,
    right = len - 1;

  while (left <= right) {
    var mid = left + ((right - left) >> 1);
    
    if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // console.log('left', left);

  console.log('lowBound:', 'left', left, 'right', right);

  // if (left >= len || nums[left] !== target) {
  //   return -1;
  // }

  return left;
}

// 二分查右边界
// var highBound = function (nums, target) {
//   var len = nums.length,
//     left = 0,
//     right = len;

//   while (left < right) {
//     var mid = left + ((right - left) >> 1);

//     if (nums[mid] <= target) {
//       left = mid + 1;
//     } else {
//       right = mid;
//     }
//   }

//   console.log('left', left - 1);
//  return left - 1;
// }

var highBound = function (nums, target) {
    var len = nums.length,
      left = 0,
      right = len - 1;

    while (left <= right) {
      var mid = left + ((right - left) >> 1);

      if (nums[mid] <= target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    // if (right < 0 || nums[right] !== target) {
    //   return -1;
    // }

    console.log('highBound:', 'left', left, 'right', right);

    return right;
}

// var search = function (nums, target) {
//   var len = nums.length,
//       left = 0,
//       right = len,
//       leftBound = -1,
//       rightBound = -1;

//   while (left < right) {
//     var mid = left + ((right - left) >> 1);

//     if (nums[mid] < target) {
//       left = mid + 1;
//     } else {
//       right = mid;
//     }
//   }

//   leftBound = left;

//   left = 0;
//   right = len;

//   while (left < right) {
//     var mid = left + ((right - left) >> 1);

//     if (nums[mid] <= target) {
//       left = mid + 1;
//     } else {
//       right = mid;
//     }
//   }

//   rightBound = left - 1;

//   console.log('leftBound', leftBound, 'rightBound', rightBound);

//   return rightBound - leftBound + 1;
// }

var search = function (nums) {
  var len = nums.length,
      left = 0,
      right = len - 1,
      leftBound = -1,
      rightBound = -1;

    while (left <= right) {
        var mid = left + ((right - left) >> 1);

        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    leftBound = left;

    left = 0;

    right = len - 1;

    while (left <= right) {
        var mid = left + ((right - left) >> 1);

        if (nums[mid] <= target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    rightBound = right;

  console.log('leftBound', leftBound, 'rightBound', rightBound);

  return rightBound - leftBound + 1;
}

// nums = [5,7,7,8,8,10], target = 8
var nums = [];
var target = 0;
// var nums = [1];
// var target = 1;
// var nums = [5,7,7,8,8,10];
// var target = 8;
// lowBound(nums, target);
// highBound(nums, target);
// console.log('res', res);
var res = search(nums, target);
console.log(res);