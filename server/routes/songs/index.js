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
const DEFAULT_SONG_LIMIT = 16;

const parseGetParams = request => {
  const params = request.query || {}
  return {
    songsLimit: params.limit || DEFAULT_SONG_LIMIT,
    songsOffset: params.offset || 0,
    subgenreIds: params.tags && JSON.parse(params.tags) || {},
    omitSongIds: params.omitSongIds && JSON.parse(params.omitSongIds) || {}
  };
}

router.get('/', (req, res) => {
  return getSongs(parseGetParams(req))
    .then(includeNestedRelations)
    .then(songs => res.json(songs))
    .catch(e => console.log('>>> GET SONGS fetch error', e));
});

router.get('/shuffle', (req, res) => {
  const params = { ...parseGetParams(req), isShuffle: true };
  return getSongs(params)
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
