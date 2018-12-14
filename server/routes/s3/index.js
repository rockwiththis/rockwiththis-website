const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

const parseFormRequestFiles = request => {
  new Promise(resolve => {
    formidable.IncomingForm().parse(req, (err, fields, files) => {
      resolve(files)
    })
  })
}

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
  console.log(req);
  return parseFormRequestFiles(req)
    .then(files => {
      console.log("parsed form input");
      console.log(files);
      const path = files.filetoupload.path;
      console.log(`path: ${path}`);
      const buffer = fs.readFileSync(path);
      console.log(`buffer: ${buffer}`);
      const type = fileType(buffer);
      console.log(`type: ${type}`);
      const timestamp = Date.now().toString();
      const fileName = `bucketFolder/${timestamp}-lg`;
      console.log(`fileName: ${fileName}`);
      uploadFile(buffer, fileName, type);
      return response.status(200).send(data);
    })
    .then(data => {
      console.log()
      console.log("final data")
      console.log(data);
      return res.status(200).send(data)
    })
});

module.exports = router;
