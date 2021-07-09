function myInstanceOf(l, r) {
  let proto = Object.getPrototypeOf(l),
    prototype = r.prototype;

  while (true) {
    if (!proto) {
      return false;
    }
    if (proto === prototype) {
      return true;
    }

    proto = Object.getPrototypeOf(proto);
  }
}