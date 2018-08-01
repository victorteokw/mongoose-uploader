const path = require('path');

const randomString = () =>
  Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

module.exports = {
  options: {
    storePath: undefined,
    filename: undefined,
    randomFilename: true
  },
  storePath(originalFilename) {
    if (this.options.storePath) {
      return this.options.storePath(originalFilename);
    } else {
      return '/';
    }
  },
  filename(original) {
    if (this.options.filename) {
      return this.options.filename(original);
    } else if (this.options.randomFilename) {
      return randomString() + path.extname(original);
    } else {
      return original;
    }
  }
};
