const get = (obj, path) => {
  if (!obj) {
    return null;
  }

  const resolveIndex = (key) => {
    const reg = /\[(\d+)\]/g;
    // const indexs = [];
    // let matchRes;
    let wholeKey = key;

    // while ((matchRes = reg.exec(key))) {
    //   indexs.push(matchRes[1]);
    // }
    const indexs = [...wholeKey.matchAll(reg)].map(i => i ? i[1] : undefined);

    if (indexs.length > 0) {
      wholeKey = wholeKey.slice(0, wholeKey.indexOf(indexs[0]) - 1);
    }

    return [wholeKey, ...indexs];
  }

  const keys = path.split('.').reduce((acc, cur) => {
    const res = resolveIndex(cur);
    acc = acc.concat(res);
    return acc;
  }, []);

  console.log('keys', keys);
  let value = obj;
  
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];

    if (value[key] !== undefined && value[key] !== null) {
      value = value[key];
    } else {
      return null;
    }
  }

  return value;
};

// function nextSplit(key) {
//   const cartfulIndexs = [];
//   const regx = /\[(\d+)\]/g;
//   let wholeKey = key;
//   let matchResult;
//   while ((matchResult = regx.exec(key))) {
//     cartfulIndexs.push(matchResult[1]);
//   }
//   if (cartfulIndexs.length) {
//     wholeKey = wholeKey.substring(0, wholeKey.indexOf(cartfulIndexs[0]) - 1);
//   }
//   return [wholeKey, ...cartfulIndexs];
// }

// const res = nextSplit('d[1][2]');
const res = get({
  a: {
    b: {
      c: {
        d: [
          [],
          [1, 2, 3, {
            e: {
              f: 4,
            }
          }]
        ],
        e: 'e',
      }
    }
  }
},
'a.b.c.d[1][3].e'
// 'a.b.c.e'
);

console.log('res', res);