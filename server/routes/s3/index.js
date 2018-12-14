const express = require('express');
const router = express.Router();

const AWS = require('aws-sdk');

const formidable = require('formidable');
const fs = require('fs');
const fileType = require('file-type');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

const parseFormRequestFile = request => (
  new Promise(resolve => {
    formidable.IncomingForm().parse(request, (err, fields, fileData) => {
      /*
      console.log("Parse Form - Error");
      console.log(err);
      console.log("Parse Form - Fields");
      console.log(fields);
      console.log("Parse Form - Files");
      console.log(files);
      */
      resolve(fileData.file)
    })
  })
);

const uploadFile = (buffer, name, type) => {
  console.log({
    ACL: 'publlic-read',
    Body: buffer,
    Bucket: 'rockwiththis',
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  });
  return Promise.resolve("fakepath.jpg");
};

router.post('/upload', (req, res) => {
  console.log("received request");
  return parseFormRequestFile(req)
    .then(file => {
      const buffer = fs.readFileSync(file.path);
      const type = fileType(buffer);
      const timestamp = Date.now().toString();
      const fileName = `rockwiththis/${timestamp}-lg`;
      return uploadFile(buffer, fileName, type);
    })
    .then(url => {
      console.log("saved path")
      console.log(url);
      return res.status(200).json({ s3ImageUrl: url })
    })
});

module.exports = router;
