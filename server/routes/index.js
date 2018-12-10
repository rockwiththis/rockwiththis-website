const express = require('express');
const router = express.Router();

const songs = require('./songs');
const subgenres = require('./subgenres');
const curators = require('./curators');
const user = require('./user');

const cookieParser = require('cookie-parser')
router.use(cookieParser());

router.use('/songs', songs);
router.use('/subgenres', subgenres);
router.use('/curators', curators);
router.use('/user', user);

module.exports = router;
