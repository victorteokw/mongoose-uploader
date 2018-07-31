const path = require('path');

const randomString = () =>
  Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

module.exports = {
  setup(options) {
    const { storePath, filename, randomFilename } = options;
    storePath && (this.storePath = storePath);
    filename && (this.filename = filename);
    if (randomFilename !== undefined) {
      this.randomFilename = !!randomFilename;
    }
  },
  randomFilename: true,
  storePath: (_) => '/',
  filename(original) {
    if (this.randomFilename) {
      return randomString() + path.extname(original);
    } else {
      return original;
    }
  }
};
