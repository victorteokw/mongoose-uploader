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
  applyOptions(options) {
    const { storePath, filename, randomFilename } = options;

  },
  storePath: (_) => '/',
  filename(original) {
    if (this.options.randomFilename) {
      return randomString() + path.extname(original);
    } else {
      return original;
    }
  }
};
