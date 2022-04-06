// tools/throttle.js
const throttle = (callback, wait=100) => {
  let last = Date.now();
  let tailCallId;

  return event => {
    window.clearTimeout(tailCallId);
    const now = Date.now();
    const elapsed = now - last;

    if (elapsed >= wait) {
      window.called = (window.called ?? 0) + 1;
      last = now;
      callback(event);
    } else {
      tailCallId = window.setTimeout(() => {
        window.tailing = (window.tailing ?? 0) + 1;
        callback(event);
        last = now;
      }, wait - elapsed);
    }
  };
};

export default throttle;
