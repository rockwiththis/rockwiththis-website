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
        resolve({
          file: fileData.file,
          fileName: fields.fileName.split('.')[0]
        })
      })
    })
);

const parseFormRequestFields = request => (
  new Promise(resolve => {
    formidable.IncomingForm().parse(request, (err, fields, fileData) => {
      resolve(fields);
    })
  })
);

const uploadFile = (buffer, name, type, isPrivate) => {
  const params = {
    ACL: isPrivate ? 'private' : 'public-read',
    Body: buffer,
    Bucket: 'rockwiththis',
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  };
  return s3.upload(params).promise();
};

const processUpload = (req, isPrivate, path, fileNameOverride) => (
    parseFormRequestFile(req)
      .then(fileData => {
        const buffer = fs.readFileSync(fileData.file.path);
        const type = fileType(buffer);
        const fileName = !!fileNameOverride ? fileNameOverride : fileData.fileName

        return uploadFile(buffer, `${path}/${fileName}`, type, isPrivate)
          .then(file => ({
            file,
            fileName: `${fileName}.${type.ext}`
          }));
      })
);

router.post('/upload/image', (req, res) => (
    processUpload(req, false, 'song-uploads', `${Date.now().toString()}-lg`)
      .then(({ file }) => {
        console.log("Successfully uploaded image")
        return res.status(200).json({ s3ImageUrl: file.Location })
      })
      .catch(e => {
        console.log("failure uploading image");
        console.log(e);
        return res.status(500)
      })
));

router.post('/upload/song', (req, res) => (
    processUpload(req, true, 'songs')
      .then(({ fileName }) => {
        console.log("Successfully uploaded song audio")
        return res.status(200).json({ s3SongName: fileName })
      })
      .catch(e => {
        console.log("failure uploading song audio");
        console.log(e);
        return res.status(500)
      })
));

module.exports = router;
