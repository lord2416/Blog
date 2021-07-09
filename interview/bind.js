if (!Function.prototype.bind) {
  Function.prototype.bind = function (ctx, ...oArgs) {
    const fn = this;
    return function (...iArgs) {
      const args = oArgs.concat(iArgs);
      return fn.call(ctx, ...args);
    }
  }
}