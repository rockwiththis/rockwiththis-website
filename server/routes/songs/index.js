const express = require('express');
const router = express.Router();
const database = require('../../db');
const {
  nestSingleSongWithGenres,
  nestResultingSongsWithGenres,
} = require('./utils');


router.get('/', (req, res) => {
  const isQuery = req.query && (Object.keys(req.query).length > 0);

  // 'tag' queries
  const queryTags = (isQuery && req.query.tags && JSON.parse(req.query.tags)) || [];
  const isQueryTags = (queryTags.length > 0);
  const queryTagsWHEREStatement = (
    isQueryTags ? `AND subgenres.id = ANY(ARRAY${req.query.tags})` : ''
  );

  // 'limit' query
  const queryLimit = (isQuery && req.query.limit) || 16;
  const queryLimitStatement = `LIMIT ${Number(queryLimit)}`;

  // 'offset' query
  const queryOffset = (isQuery && req.query.offset) || 0;
  const queryOffsetStatement = `OFFSET ${Number(queryOffset)}`;

  const queryText = (`
    SELECT song.* , subgenres.id as genre_id, subgenres.name as genre_name
    FROM songs
    JOIN subgenre_songs
    ON songs.id = subgenre_songs.song_id
    JOIN subgenres
    ON (subgenres.id = subgenre_songs.subgenre_id ${queryTagsWHEREStatement})
    ${queryOffsetStatement}
    ${queryLimitStatement}
  `);
  // const queryText = (`
  //   SELECT s1.*, subgenres.id as genre_id, subgenres.name as genre_name
  //   FROM (
  //     SELECT *
  //     from songs
  //     ORDER BY created_at desc
  //     ${queryOffsetStatement}
  //     ${queryLimitStatement}
  //   ) as s1
  //   JOIN subgenre_songs
  //   ON s1.id = subgenre_songs.song_id
  //   JOIN subgenres
  //   ON (subgenres.id = subgenre_songs.subgenre_id ${queryTagsWHEREStatement})
  //   ORDER BY s1.id asc
  // `);



  const queryObj = {
    text: queryText,
    // values: [${queryOffsetStatement}, ${queryLimitStatement}, ${queryTagsWHEREStatement}]
  };

  database.query(queryObj)
  .then(result => {
    const songsWithSubGenres = nestResultingSongsWithGenres(result.rows);
    res.json(songsWithSubGenres);
  })
  .catch((error) => {
    console.log('>>> GET SONGS route error', error);
    res.json([]);
  });
});


router.get('/:id', (req, res) => {
  var singleSongId = parseInt(req.params.id);
  const query = {
    text: 'SELECT subgenres.id as genre_id, subgenres.name as genre_name, songs.* FROM songs JOIN subgenre_songs ON songs.id = subgenre_songs.song_id JOIN subgenres ON subgenres.id = subgenre_songs.subgenre_id WHERE songs.id = $1',
    values: [singleSongId],
  }

  database.query(query)
  .then(results => {

    const singleSongWithSubGenres = nestSingleSongWithGenres(results.rows);

    return res.json(singleSongWithSubGenres);
  })
})


module.exports = router;
