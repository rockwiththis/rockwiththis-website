const express = require('express');
const router = express.Router();

const {
  getSongs,
  getSingleSong,
  includeNestedRelations
} = require('./util/read.js');

const {
  insertSong,
  updateSong,
  deleteSong
} = require('./util/write.js');

const { checkSession } = require('../../auth/util');

// TODO define this in some shared place
const DEFAULT_SONG_LIMIT = 32;

router.get('/', (req, res) => {
  const params = req.query || {};

  const songsLimit = params.limit || DEFAULT_SONG_LIMIT;
  const songsOffset = params.offset || 0;
  const subgenreIdFilter = params.tags && JSON.parse(params.tags) || [];
  const omitSongIds = params.omitSongIds && JSON.parse(params.omitSongIds) || [];

  return getSongs(songsLimit, songsOffset, subgenreIdFilter, omitSongIds)
    .then(includeNestedRelations)
    .then(songs => res.json(songs))
    .catch(e => console.log('>>> GET SONGS fetch error', e));
});

router.get('/:id', (req, res) => {
  const singleSongId = parseInt(req.params.id);

  return getSingleSong(singleSongId)
    .then(song => includeNestedRelations([song]))
    .then(nestResult => res.json(nestResult[0]))
    .catch(e => console.log('>>> GET SINGLE SONG fetch error', e));
});

router.post('/', (req, res) => (
  checkSession(req.body)
    .then(() => insertSong(req.body))
    .then(() => handleWriteSuccess(res, 'insert'))
    .catch(e => handleWriteError(res, e))
));

router.patch('/:id', (req, res) => {
  checkSession(req.body)
    .then(() => updateSong(Number.parseInt(req.params.id), req.body))
    .then(() => handleWriteSuccess(res, 'update'))
    .catch(e => handleWriteError(res, e))
});

router.delete('/:id', (req, res) => (
  checkSession(req.body)
    .then(() => deleteSong(req.params.id, req.body))
    .then(() => handleWriteSuccess(res, 'delete'))
    .catch(e => handleWriteError(res, e))
));

const handleWriteSuccess = (res, opString) => {
  console.log(`${opString} successful!`);
  return res.sendStatus(200);
};

const handleWriteError = (res, error) => {
  if (error == 400) {
    return res.sendStatus(400);
  } else {
    console.log('Unexpected error:');
    console.log(error);
    return res.sendStatus(500);
  }
};

module.exports = router;
