/*
  Give javascript arrays a `random` function that will
  return a random element.
*/
Array.prototype.randomElement = function () {
  return this[Math.floor(Math.random() * this.length)];
};
