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
  if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
  }
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


it('uploads for nested fields', (done) => {
  const doc = new NestedModel({
    str: 'str val',
    num: 2,
    profile: {
      avatar: new Promise(function(resolve) {
        resolve({
          stream: fs.createReadStream(path.join(__dirname, 'sample.jpg')),
          filename: 'avatar.jpg',
          mimetype: 'image/jpeg',
          encoding: 'utf-8'
        });
      })
    },
    profile2: {
      info: {
        photos: [
          new Promise(function(resolve) {
            resolve({
              stream: fs.createReadStream(path.join(__dirname, 'sample2.jpg')),
              filename: 'photo1.jpg',
              mimetype: 'image/jpeg',
              encoding: 'utf-8'
            });
          }),
          new Promise(function(resolve) {
            resolve({
              stream: fs.createReadStream(path.join(__dirname, 'sample3.jpg')),
              filename: 'photo2.jpg',
              mimetype: 'image/jpeg',
              encoding: 'utf-8'
            });
          })
        ]
      }
    }
  });
  doc.save().then((doc) => {
    expect(doc.profile.avatar.filename).toBe('avatar.jpg');
    expect(doc.profile.avatar.mimetype).toBe('image/jpeg');
    expect(doc.profile.avatar.encoding).toBe('utf-8');
    expect(doc.profile.avatar.url).toBe('www.example.com/avatar.jpg');
    expect(doc.profile2.info.photos[0].filename).toBe('photo1.jpg');
    expect(doc.profile2.info.photos[0].mimetype).toBe('image/jpeg');
    expect(doc.profile2.info.photos[0].encoding).toBe('utf-8');
    expect(doc.profile2.info.photos[0].url).toBe('www.example.com/photo1.jpg');
    expect(doc.profile2.info.photos[1].filename).toBe('photo2.jpg');
    expect(doc.profile2.info.photos[1].mimetype).toBe('image/jpeg');
    expect(doc.profile2.info.photos[1].encoding).toBe('utf-8');
    expect(doc.profile2.info.photos[1].url).toBe('www.example.com/photo2.jpg');
    done();
  });
});

it('updates for simple model, removes old file', (done) => {
  const doc = new Simple({
    str: 'str val',
    num: 2,
    file: new Promise(function(resolve) {
      resolve({
        stream: fs.createReadStream(path.join(__dirname, 'sample.jpg')),
        filename: 'upload1.jpg',
        mimetype: 'image/jpeg',
        encoding: 'utf-8'
      });
    })
  });
  doc.save().then((doc) => {
    expect(fs.existsSync(path.join(__dirname, 'uploads', 'upload1.jpg'))).toBe(true);
    doc.set({
      file: new Promise(function(resolve) {
        resolve({
          stream: fs.createReadStream(path.join(__dirname, 'sample2.jpg')),
          filename: 'upload2.jpg',
          mimetype: 'image/jpeg',
          encoding: 'utf-8'
        });
      })
    });
    doc.save().then((doc) => {
      expect(doc.file.filename).toBe('upload2.jpg');
      expect(doc.file.mimetype).toBe('image/jpeg');
      expect(doc.file.encoding).toBe('utf-8');
      expect(doc.file.url).toBe('www.example.com/upload2.jpg');
      expect(fs.existsSync(path.join(__dirname, 'uploads', 'upload1.jpg'))).toBe(false);
      done();
    });
  });
});

it('updates for files in an array', (done) => {
  const doc = new ArrayModel({
    str: 'str val',
    num: 2,
    files: [
      new Promise(function(resolve) {
        resolve({
          stream: fs.createReadStream(path.join(__dirname, 'sample.jpg')),
          filename: 'b1.jpg',
          mimetype: 'image/jpeg',
          encoding: 'utf-8'
        });
      }),
      new Promise(function(resolve) {
        resolve({
          stream: fs.createReadStream(path.join(__dirname, 'sample2.jpg')),
          filename: 'b2.jpg',
          mimetype: 'image/jpeg',
          encoding: 'utf-8'
        });
      })
    ]
  });
  doc.save().then((doc) => {
    doc.set({
      files: [
        new Promise(function(resolve) {
          resolve({
            stream: fs.createReadStream(path.join(__dirname, 'sample.jpg')),
            filename: 'b3.jpg',
            mimetype: 'image/jpeg',
            encoding: 'utf-8'
          });
        }),
        new Promise(function(resolve) {
          resolve({
            stream: fs.createReadStream(path.join(__dirname, 'sample2.jpg')),
            filename: 'b4.jpg',
            mimetype: 'image/jpeg',
            encoding: 'utf-8'
          });
        })
      ]
    });
    expect(fs.existsSync(path.join(__dirname, 'uploads', 'b1.jpg'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, 'uploads', 'b2.jpg'))).toBe(true);
    doc.save().then((doc) => {
      expect(doc.files[0].filename).toBe('b3.jpg');
      expect(doc.files[0].mimetype).toBe('image/jpeg');
      expect(doc.files[0].encoding).toBe('utf-8');
      expect(doc.files[0].url).toBe('www.example.com/b3.jpg');
      expect(doc.files[1].filename).toBe('b4.jpg');
      expect(doc.files[1].mimetype).toBe('image/jpeg');
      expect(doc.files[1].encoding).toBe('utf-8');
      expect(doc.files[1].url).toBe('www.example.com/b4.jpg');
      expect(fs.existsSync(path.join(__dirname, 'uploads', 'b1.jpg'))).toBe(false);
      expect(fs.existsSync(path.join(__dirname, 'uploads', 'b2.jpg'))).toBe(false);
      expect(fs.existsSync(path.join(__dirname, 'uploads', 'b3.jpg'))).toBe(true);
      expect(fs.existsSync(path.join(__dirname, 'uploads', 'b4.jpg'))).toBe(true);
      done();
    });
  });
});

it('remove file when removing', (done) => {
  const doc = new Simple({
    str: 'str val',
    num: 2,
    file: new Promise(function(resolve) {
      resolve({
        stream: fs.createReadStream(path.join(__dirname, 'sample.jpg')),
        filename: 'to-be-removed.jpg',
        mimetype: 'image/jpeg',
        encoding: 'utf-8'
      });
    })
  });
  doc.save().then((doc) => {
    expect(fs.existsSync(path.join(__dirname, 'uploads', 'to-be-removed.jpg'))).toBe(true);
    doc.remove().then((doc) => {
      expect(fs.existsSync(path.join(__dirname, 'uploads', 'to-be-removed.jpg'))).toBe(false);
      done();
    });
  });
});

it('remove file when setting to null', (done) => {
  const doc = new Simple({
    str: 'str val',
    num: 2,
    file: new Promise(function(resolve) {
      resolve({
        stream: fs.createReadStream(path.join(__dirname, 'sample.jpg')),
        filename: 'null.jpg',
        mimetype: 'image/jpeg',
        encoding: 'utf-8'
      });
    })
  });
  doc.save().then((doc) => {
    expect(fs.existsSync(path.join(__dirname, 'uploads', 'null.jpg'))).toBe(true);
    doc.set({file: null}).save().then((doc) => {
      expect(fs.existsSync(path.join(__dirname, 'uploads', 'null.jpg'))).toBe(false);
      done();
    });
  });
});
