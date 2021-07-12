function minDistance(str1, str2) {
  var n = str1.length;
  var m = str2.length;

  if (n * m === 0) {
    return n + m;
  }

  var dp = new Array(n + 1).fill(0).map(i => new Array(m).fill(0));

  for (let i = 0; i < n + 1; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j < m + 1; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i < n + 1; i++) {
    for (let j = 1; j < m + 1; j++) {
      let left = dp[i - 1][j] + 1;
      let down = dp[i][j - 1] + 1;
      let leftDown = dp[i - 1][j - 1];

      if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
        leftDown += 1;
      }

      dp[i][j] = Math.min(left, Math.min(down, leftDown));
    }
  }

  console.log(dp);
  console.log('n', n, 'm', m, 'dp[n][m]', dp[n][m]);

  return dp[n][m];
}

minDistance("horse", "ros");