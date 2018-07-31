const mongoose = require('mongoose');

const File = function(key, options) {
  mongoose.SchemaType.call(this, key, options, 'File');
};

File.prototype = Object.create(mongoose.SchemaType.prototype);

File.prototype.cast = (arg) => arg;

mongoose.Schema.Types.File = File;

module.exports = File;
