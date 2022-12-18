console.log('foobar 1');
window.addEventListener(
  'DOMContentLoaded',
  () => {
    console.log('foobar');
    console.log(process.env.PORT);
    // window.location.reload();
  },
  { once: true }
);
