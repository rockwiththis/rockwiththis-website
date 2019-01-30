const express = require('express');
const router = express.Router();
const database = require('../../db');

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

router.get('/', (req, res) => {
  const isQuery = req.query && (Object.keys(req.query).length > 0);

  const songsLimit = (isQuery && req.query.limit) || DEFAULT_SONG_LIMIT;
  const songsOffset = (isQuery && req.query.offset) || 0;
  const subgenreIdFilter = (isQuery && req.query.tags && JSON.parse(req.query.tags)) || [];

  return getSongs(songsLimit, songsOffset, subgenreIdFilter)
    .then(includeNestedRelations)
    .then(res.json)
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
  database.query('BEGIN')
    .then(() => checkSession(req.body))
    .then(() => database.query(getInsertSongQuery(req.body)))
    .then(insertSongResponse => insertSongSubgenres(insertSongResponse, req.body))
    .then(() => database.query('COMMIT'))
    .then(() => handleWriteSuccess(res, 'insert'))
    .catch(e => handleWriteError(res, e))
));

// TODO move this to utils/write.js
const insertSongSubgenres = (songDbResponse, params) => {
  const insertedSongIds = songDbResponse.rows.map(r => r.id);
  if (insertedSongIds.length != 1) return Promise.reject("bad db insert response: " + songDbResponse)

  const subgenreQuery = getInsertSubgenreSongQuery(insertedSongIds[0], params);
  return !!subgenreQuery ?
    database.query(subgenreQuery) :
    Promise.resolve()
}

router.patch('/:id', (req, res) => (
  database.query('BEGIN')
    .then(() => checkSession(req.body))
    .then(() => database.query(getDeleteSubgenreSongQuery(req.params.id)))
    .then(() => database.query(getUpdateSongQuery(req.params.id, req.body)))
    .then(() => database.query(getInsertSubgenreSongQuery(req.params.id, req.body)))
    .then(() => database.query('COMMIT'))
    .then(() => handleWriteSuccess(res, 'update'))
    .catch(e => handleWriteError(res, e))
));

router.delete('/:id', (req, res) => (
  database.query('BEGIN')
    .then(() => checkSession(req.body))
    .then(() => database.query(getDeleteSubgenreSongQuery(req.params.id)))
    .then(() => database.query(getDeleteSongQuery(req.params.id)))
    .then(() => database.query('COMMIT'))
    .then(() => handleWriteSuccess(res, 'delete'))
    .catch(e => handleWriteError(res, e))
));

// TODO move these to utils/write.js
const handleWriteSuccess = (res, opString) => {
  console.log(`${opString} successful!`);
  console.log(res);
  return res.sendStatus(200);
};

const handleWriteError = (res, error) => (
  database.query('ROLLBACK').then(() => {
    if (error == 400) {
      return res.sendStatus(400);
    } else {
      console.log('Unexpected error:');
      console.log(error);
      return res.sendStatus(500);
    }
  })
);

module.exports = router;
