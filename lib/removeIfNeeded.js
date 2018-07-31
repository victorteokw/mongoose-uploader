const mongoose = require('mongoose');
const isPlainObject = require('is-plain-object');
const get = require('lodash.get');
const fill = require('lodash.fill');

const File = require('./File');

const removeIfNeeded = async (schemaTree, doc, path) => {
  await Promise.all(Object.keys(schemaTree).map(async (key) => {
    const item = schemaTree[key];
    const val = get(doc._uploaderOriginal, path.concat(key));

    if (val === undefined || val === null) {
      // Value not defined
    } else if (item === File) {
      throw 'Please provide an uploader.';
    } else if (item.type === File) {
      if (item.uploader.remove) {
        await item.uploader.remove(val);
      }
    } else if (item.type) {
      // Non file primitive type
    } else if (Array.isArray(item)) {
      const obj = {};
      fill(Array(val.length), item[0]).forEach((p, i) => obj[i] = p);
      await removeIfNeeded(obj, doc, path.concat([key]));
    } else if (isPlainObject(item)) {
      // Plain nested object
      await removeIfNeeded(item, doc, path.concat(key));
    } else if (item instanceof mongoose.Schema) {
      // Subschema
      await removeIfNeeded(item.tree, doc, path.concat(key));
    }
  }));
};

module.exports = removeIfNeeded;
