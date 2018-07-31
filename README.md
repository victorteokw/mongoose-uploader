# mongoose-uploader
[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Dependency Status][daviddm-image]][daviddm-url]

Mongoose uploader plugin for apollo-upload-server.

# Installation
```bash
npm install mongoose-uploader --save
```

# Usage

## Setup

Use mongoose uploader plugin.

```js
const mongoose = require('mongoose');
const uploaderPlugin = require('mongoose-uploader');
// This hooks up your models and uploader plugin.
mongoose.plugin(uploaderPlugin);
```

## Defining Model

When defining the model field, just use `File` type with an `uploader` property.

```js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { File } = Schema.Types;
const ImageUploader = require('../uploaders/ImageUploader');

module.exports = new Schema({
  name: String,
  age: Number,
  avatar: { type: File, uploader: ImageUploader },
  photos: [{ type: File, uploader: ImageUploader }]
});
```

## Writing Uploader

An uploader is created with your own config by uploader packages.

```js
const { createAliOSSUploader } = require('mongoose-uploader-ali-oss');

const ImageUploader = createAliOSSUploader({
  bucket: 'your-bucket-name',
  region: 'oss-cn-shanghai',
  accessKeyId: '<your access key id>',
  accessKeySecret: '<your access key secret>'
});

module.exports = ImageUploader;
```

# Base Uploaders

* [AmazonS3Uploader](https://github.com/zhangkaiyulw/mongoose-uploader-amazon-s3)
* [AliOSSUploader](https://github.com/zhangkaiyulw/mongoose-uploader-ali-oss)


[travis-image]: https://travis-ci.org/zhangkaiyulw/mongoose-uploader.svg?branch=master
[travis-url]: https://travis-ci.org/zhangkaiyulw/mongoose-uploader
[npm-image]: https://badge.fury.io/js/mongoose-uploader.svg
[npm-url]: https://npmjs.org/package/mongoose-uploader
[daviddm-image]: https://david-dm.org/zhangkaiyulw/mongoose-uploader.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/zhangkaiyulw/mongoose-uploader
