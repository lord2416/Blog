function bigAdd(n1, n2) {
  const arr1 = n1.split('');
  const arr2 = n2.split('');
  const res = [];
  let j = 0;

  console.log(arr1, arr2);

  while (arr1.length > 0 || arr2.length > 0 || j !== 0) {
    let cur1 = arr1.pop() || 0;
    let cur2 = arr2.pop() || 0;
    let acc = +cur1 + +cur2 + j;
    res.unshift(acc % 10);
    j = acc >= 10 ? 1 : 0;
  }

  console.log('res', res);

  return res.join('');
}

const a = bigAdd(`${Number.MAX_VALUE}`, `${Number.MAX_VALUE}`);
console.log('bigAdd', a);