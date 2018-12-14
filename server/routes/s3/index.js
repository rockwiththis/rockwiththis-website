const express = require('express');
const router = express.Router();

const AWS = require('aws-sdk');

const formidable = require('formidable');
const fs = require('fs');
const fileType = require('file-type');

const s3 = new AWS.S3();

const parseFormRequestFile = request => (
  new Promise(resolve => {
    formidable.IncomingForm().parse(request, (err, fields, fileData) => {
      resolve(fileData.file)
    })
  })
);

const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: 'rockwiththis',
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  };
  return s3.upload(params).promise();
};

router.post('/upload', (req, res) => {
  console.log("received request");
  console.log(AWS.config.credentials);
  return parseFormRequestFile(req)
    .then(file => {
      const buffer = fs.readFileSync(file.path);
      const type = fileType(buffer);
      const timestamp = Date.now().toString();
      const fileName = `song-uploads/${timestamp}-lg`;
      return uploadFile(buffer, fileName, type);
    })
    .then(data => {
      console.log("SUCCESS!!!")
      console.log(data);
      return res.status(200).json({ s3ImageUrl: data.Location })
    })
    .catch(e => {
      console.log("failure");
      console.log(e);
      return res.status(500)
    });
});

module.exports = router;
