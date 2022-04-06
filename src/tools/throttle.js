// tools/throttle.js
const throttle = (handler, wait=100) => {
  let last = Date.now();
  let tailCallId;

  return event => {
    window.clearTimeout(tailCallId);
    const now = Date.now();
    const elapsed = now - last;

    if (elapsed >= wait) {
       window.called = (window.called ?? 0) + 1;
      last = now;
      handler(event);
    } else {
      tailCallId = window.setTimeout(() => {
         window.tailing = (window.tailing ?? 0) + 1;
         handler(event);
         last = now;
      }, wait - elapsed);
    }
  };
};

export default throttle;
