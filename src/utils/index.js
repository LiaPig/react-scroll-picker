const debounce = (func, wait) => {
  let timeoutId;
  // 返回一个新的函数，
  return function (...args) {
    clearTimeout(timeoutId);
    // 开启新的一个定时器
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

export {
  debounce,
};
