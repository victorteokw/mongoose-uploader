const baseUploader = require('../lib/baseUploader');

it('path default to root', () => {
  const storePath = baseUploader.storePath('abc.jpg');
  expect(storePath).toBe('/');
});

it('filename default to random string', () => {
  const filename1 = baseUploader.filename('abc.jpg');
  const filename2 = baseUploader.filename('def.jpg');
  expect(filename1).toMatch(/[a-z0-9]+\.jpg/);
  expect(filename2).toMatch(/[a-z0-9]+\.jpg/);
  expect(filename1).not.toBe(filename2);
});
