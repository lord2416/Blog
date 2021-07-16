var longestIncreasingSubsqueues = (nums) => {
  var len = nums.length;

  if (len <= 1) {
    return len;
  }

  var res = [nums[0]],
    rightRes = [...res];

  for (var i = 1; i < len; i++) {
    if (nums[i] > res[res.length - 1]) {
      res.push(nums[i]);
      rightRes.push(nums[i]);
    } else {
      var left = 0,
        right = res.length - 1;

      while (left <= right) {
        var mid = left + ((right - left) >> 1);
        if (nums[mid] <= nums[i]) {
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }

      res[left] = nums[i];

      if (left >= res.length - 1) {
        rightRes = [...res];
      }
    }
  }

  console.log('res', res);
  console.log('rightRes', rightRes);

  return res.length;
}

longestIncreasingSubsqueues([10,9,2,5,3,4,7,101]);