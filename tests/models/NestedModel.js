const mongoose = require('mongoose');
const { Schema } = mongoose;
const { File } = Schema.Types;
const FakeUploader = require('../uploaders/FakeUploader');

const nestedModelSchema = new Schema({
  str: String,
  num: Number,
  profile: {
    avatar: { type: File, uploader: FakeUploader },
    name: String
  },
  profile2: new Schema({
    info: {
      photos: [{ type: File, uploader: FakeUploader }]
    }
  })
});

module.exports = mongoose.model('NestedModel', nestedModelSchema);
