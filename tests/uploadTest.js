const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);
const uploadPlugin = require('../index');
mongoose.plugin(uploadPlugin);
const Simple = require('./models/Simple');
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
