const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const uploadPlugin = require('../index');
mongoose.plugin(uploadPlugin);
const Simple = require('./models/Simple');
const ArrayModel = require('./models/ArrayModel');
const NestedModel = require('./models/NestedModel');
const fs = require('fs');
const path = require('path');

beforeAll(function(done) {
  mockgoose.prepareStorage().then(function() {
    mongoose.connect('mongodb://example.com/testing', function(err) {
      done(err);
    });
  });
});

afterAll(async () => {
  try {
    const { connections } = mongoose;
    const { childProcess } = mockgoose.mongodHelper.mongoBin;
    childProcess.kill();
    await Promise.all(connections.map(c => c.close()));
    await mongoose.disconnect();
  } catch (err) {
    console.log('Error in afterAll : ', err);
  }
});

it('uploads for simple model', (done) => {
  const doc = new Simple({
    str: 'str val',
    num: 2,
    file: new Promise(function(resolve) {
      resolve({
        stream: fs.createReadStream(path.join(__dirname, 'sample.jpg')),
        filename: 'sample.jpg',
        mimetype: 'image/jpeg',
        encoding: 'utf-8'
      });
    })
  });
  doc.save().then((doc) => {
    expect(doc.file.filename).toBe('sample.jpg');
    expect(doc.file.mimetype).toBe('image/jpeg');
    expect(doc.file.encoding).toBe('utf-8');
    expect(doc.file.url).toBe('www.example.com/sample.jpg');
    done();
  });
});

it('uploads for files in an array', (done) => {
  const doc = new ArrayModel({
    str: 'str val',
    num: 2,
    files: [
      new Promise(function(resolve) {
        resolve({
          stream: fs.createReadStream(path.join(__dirname, 'sample.jpg')),
          filename: 'a1.jpg',
          mimetype: 'image/jpeg',
          encoding: 'utf-8'
        });
      }),
      new Promise(function(resolve) {
        resolve({
          stream: fs.createReadStream(path.join(__dirname, 'sample2.jpg')),
          filename: 'a2.jpg',
          mimetype: 'image/jpeg',
          encoding: 'utf-8'
        });
      })
    ]
  });
  doc.save().then((doc) => {
    console.log(doc.files);
    expect(doc.files[0].filename).toBe('a1.jpg');
    expect(doc.files[0].mimetype).toBe('image/jpeg');
    expect(doc.files[0].encoding).toBe('utf-8');
    expect(doc.files[0].url).toBe('www.example.com/a1.jpg');
    expect(doc.files[1].filename).toBe('a2.jpg');
    expect(doc.files[1].mimetype).toBe('image/jpeg');
    expect(doc.files[1].encoding).toBe('utf-8');
    expect(doc.files[1].url).toBe('www.example.com/a2.jpg');
    done();
  });
});
