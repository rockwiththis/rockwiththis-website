const express = require('express');
const router = express.Router();
const database = require('../../db');
const {
  querySongs,
  querySongSubgenres,
  nestSongsWithSubgenres,
  nestSingleSongWithGenres,
} = require('./util/get.js');

// TODO define this in some shared place
const DEFAULT_SONG_LIMIT = 16;

router.get('/', (req, res) => {
  console.log("fetching songs");
  const isQuery = req.query && (Object.keys(req.query).length > 0);

  const songsLimit = (isQuery && req.query.limit) || DEFAULT_SONG_LIMIT;
  const songsOffset = (isQuery && req.query.offset) || 0;
  const subgenreIdFilter = (isQuery && req.query.tags && JSON.parse(req.query.tags)) || [];

  // TODO use promises to avoid ugly nesting
  querySongs(songsLimit, songsOffset, subgenreIdFilter)
    .then(songsResult => {
      querySongSubgenres(songsResult.rows.map(song => song.id))
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
})

router.post('/', (req, res) => {
  console.log(req.params);
};

router.patch('/', (req, res) => {
  console.log(req.params);
};

module.exports = router;
