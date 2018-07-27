const mongoose = require('mongoose');
const { Schema } = mongoose;
const { File } = Schema.Types;
const FakeUploader = require('../uploaders/FakeUploader');

const simpleSchema = new Schema({
  str: String,
  num: Number,
  file: { type: File, uploader: FakeUploader }
});

module.exports = mongoose.model('Simple', simpleSchema);
