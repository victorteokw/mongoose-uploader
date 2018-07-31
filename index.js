// Setup mongoose File type
require('./lib/File');

// Hooks
const uploadIfNeeded = require('./lib/uploadIfNeeded');
const removeIfNeeded = require('./lib/removeIfNeeded');

function uploaderPlugin(schema) {
  schema.pre('save', async function() {
    await uploadIfNeeded(schema.tree, this, []);
  });
  schema.pre('remove', async function() {
    await removeIfNeeded(schema.tree, this, []);
  });
}

module.exports = uploaderPlugin;
