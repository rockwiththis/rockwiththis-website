const express = require('express');
const router = express.Router();

const songs = require('./songs');
const subgenres = require('./subgenres');
const curators = require('./curators');
const users = require('./users');
const s3 = require('./s3');

const cookieParser = require('cookie-parser')
router.use(cookieParser());

router.use('/songs', songs);
router.use('/subgenres', subgenres);
router.use('/curators', curators);
router.use('/users', users);
router.use('/s3', s3);

module.exports = router;
