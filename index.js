const mongoose = require('mongoose');
const isPlainObject = require('is-plain-object');
const get = require('lodash.get');
const set = require('lodash.set');
const fill = require('lodash.fill');

const File = function(key, options) {
  mongoose.SchemaType.call(this, key, options, 'File');
};

File.prototype = Object.create(mongoose.SchemaType.prototype);

File.prototype.cast = (arg) => arg;

mongoose.Schema.Types.File = File;

const uploadIfNeeded = async (schemaTree, doc, path) => {
  await Promise.all(Object.keys(schemaTree).map(async (key) => {
    const item = schemaTree[key];
    const val = get(doc, path.concat(key));

    if (val === undefined || val === null) {
      // Value not defined
    } else if (item === File) {
      throw 'Please provide an uploader.';
    } else if (item.type === File) {
      if (val instanceof Promise) {
        // Do real upload
        set(doc, path.concat(key), await item.uploader.upload(val));
      } else {
        // Do nothing
      }
    } else if (item.type) {
      // Non file primitive type
    } else if (Array.isArray(item)) {
      const obj = {};
      fill(Array(val.length), item[0]).forEach((p, i) => obj[i] = p);
      await uploadIfNeeded(obj, doc, path.concat([key]));
    } else if (isPlainObject(item)) {
      // Plain nested object
      await uploadIfNeeded(item, doc, path.concat(key));
    } else if (item instanceof mongoose.Schema) {
      // Subschema
      await uploadIfNeeded(item.tree, doc, path.concat(key));
    }
  }));
};

const removeIfNeeded = async (schemaTree, doc, path) => {

};

function uploaderPlugin(schema) {
  schema.pre('save', async function() {
    await uploadIfNeeded(schema.tree, this, []);
  });
  schema.pre('remove', async function() {
    await removeIfNeeded(schema.tree, this, []);
  });
}

module.exports = uploaderPlugin;
