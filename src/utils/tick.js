export default function tick() {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, 0);
  });
}
