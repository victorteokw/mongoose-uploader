const mongoose = require('mongoose');
const { Schema } = mongoose;
const { File } = Schema.Types;
const FakeUploader = require('../uploaders/FakeUploader');

const arrayModelSchema = new Schema({
  str: String,
  num: Number,
  files: [{ type: File, uploader: FakeUploader }]
});

module.exports = mongoose.model('ArrayModel', arrayModelSchema);
