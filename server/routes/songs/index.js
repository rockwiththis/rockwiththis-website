const express = require('express');
const router = express.Router();
const database = require('../../db');

const {
  getSongsQuery,
  getSongsSubgenresQuery,
  nestSongsWithSubgenres,
  nestSingleSongWithGenres,
} = require('./util/read.js');

const {
  getInsertSongQuery,
  getInsertSubgenreSongQuery,
  getUpdateSongQuery,
  getDeleteSongQuery,
  getDeleteSubgenreSongQuery
} = require('./util/write.js');

// TODO define this in some shared place
const DEFAULT_SONG_LIMIT = 16;

router.get('/', (req, res) => {
  console.log("fetching songs");
  const isQuery = req.query && (Object.keys(req.query).length > 0);

  const songsLimit = (isQuery && req.query.limit) || DEFAULT_SONG_LIMIT;
  const songsOffset = (isQuery && req.query.offset) || 0;
  const subgenreIdFilter = (isQuery && req.query.tags && JSON.parse(req.query.tags)) || [];

  database.query(getSongsQuery(songsLimit, songsOffset, subgenreIdFilter))
    .then(songsResult => {
      database.query(getSongsSubgenresQuery(songsResult.rows.map(song => song.id)))
        .then(subgenresResult => {
          console.log(`successfully fetched ${songsResult.rows.length} songs`);
          res.json(nestSongsWithSubgenres(songsResult.rows, subgenresResult.rows))
        })
        .catch(error => {
          console.log('>>> GET SONGS route error fetching subgenres', error);
        });
    })
    .catch(error => {
      console.log('>>> GET SONGS route error fetching songs', error);
    });
});

// TODO use same nesting code as batch get
router.get('/:id', (req, res) => {
  var singleSongId = parseInt(req.params.id);
  const query = {
    text: 'SELECT subgenres.id as genre_id, subgenres.name as genre_name, songs.* FROM songs JOIN subgenre_songs ON songs.id = subgenre_songs.song_id JOIN subgenres ON subgenres.id = subgenre_songs.subgenre_id WHERE songs.id = $1',
    values: [singleSongId],
  }

  database.query(query)
  .then(results => {

    const singleSongWithSubGenres = nestSingleSongWithGenres(results.rows);

    return res.json(singleSongWithSubGenres[0]);
  })
});

router.post('/', (req, res) => (
  database.query('BEGIN')
    .then(() => database.query(getInsertSongQuery(req.body)))
    .then(insertSongResponse => insertSongSubgenres(insertSongResponse, req.body))
    .then(() => database.query('COMMIT'))
    .then(() => handleSuccess(res, 'insert'))
    .catch(e => database.query('ROLLBACK').then(() => handleError(res, e)))
));

const insertSongSubgenres = (songDbResponse, params) => {
  const insertedSongIds = songDbResponse.rows.map(r => r.id);
  if (insertedSongIds.length != 1) return Promise.reject("bad db insert response: " + songDbResponse)

  const subgenreQuery = getInsertSubgenreSongQuery(insertedSongIds[0], params);
  return !!subgenreQuery ?
    database.query(subgenreQuery) :
    Promise.resolve()
}

router.patch('/:id', (req, res) => (
    database.query(getUpdateSongQuery(req.params.id, req.body))
      .then(() => handleSuccess(res, 'update'))
      .catch(e => handleError(res, e))
));

router.delete('/:id', (req, res) => (
  database.query('BEGIN')
  .then(() => database.query(getDeleteSubgenreSongQuery(req.params.id)))
  .then(() => database.query(getDeleteSongQuery(req.params.id)))
  .then(() => handleSuccess(res, 'delete'))
  .catch(e => handleError(res, e))
));

const handleSuccess = (res, opString) => {
  console.log(`${opString} successful!`);
  console.log(res);
  return res.sendStatus(200);
};

const handleError = (res, error) => {
  if (error == 400) {
    return res.sendStatus(400);
  } else {
    console.log('Unexpected error:');
    console.log("res", res)

    console.log(error);
    return res.sendStatus(500);
  }
};

module.exports = router;
