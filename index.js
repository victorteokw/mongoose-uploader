const mongoose = require('mongoose');

const File = (key, options) => {
  mongoose.SchemaType.call(this, key, options, 'File');
};

File.prototype = Object.create(mongoose.SchemaType.prototype);

File.prototype.cast = (arg) => arg;

mongoose.Schema.Types.File = File;

const uploadIfNeeded = async (schemaTree, doc, path) => {
  Object.keys(schemaTree).forEach((key) => {
    const item = schemaTree[key];
    if (item === File || item.type === File) {

    } else if (item.type) {
      // Non file primitive type
    } else if (Array.isArray(item)) {

    } else if (isPlainObject(item)) {

    } else if () {

    }
  });
};

function uploaderPlugin(schema) {
  schema.pre('save', async function() {
    await uploadIfNeeded(schema.tree, this, []);
  });
  schema.pre('remove', async function() {
    await removeIfNeeded(schema.tree, this, []);
  });
};

module.exports = uploaderPlugin;
