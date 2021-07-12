var height = [0,1,0,2,1,0,1,3,2,1,2,1];

function trap(height) {
  if (!height || height.length === 0) {
    return 0;
  }

  var len = height.length,
    left = 0,
    right = len - 1,
    maxLeft = height[left],
    maxRight = height[right],
    res = 0;

  while (left < right) {
    maxLeft = Math.max(maxLeft, height[left]);
    maxRight = Math.max(maxRight, height[right]);

    if (maxLeft < maxRight) {
      res += maxLeft - height[left++];
    } else {
      res += maxRight - height[right--];
    }
  }

  return res;
}

var res = trap(height);
console.log('res', res);