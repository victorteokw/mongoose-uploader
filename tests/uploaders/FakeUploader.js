const fs = require('fs');
const path = require('path');

module.exports = {
  upload: async (upload) => {
    const { stream, filename, mimetype, encoding } = await upload;
    const writable = fs.createWriteStream(
      path.join(__dirname, '../uploads', filename)
    );
    stream.pipe(writable);
    return { filename, mimetype, encoding, url: 'www.example.com/' + filename };
  },
  remove: async (file) => {
    fs.unlinkSync(path.join(__dirname, '../uploads', file.filename));
  }
};
