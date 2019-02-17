const express = require('express');
const router = express.Router();
const database = require('../../db');

router.get('/', (req, res) => {
  database.query('SELECT * FROM subgenres')
    .then(results => {
      res.json(results.rows);
    });
});

const groupedSubgenreQuery = `
  SELECT
    genre.id as genre_id, genre.name as genre_name, genre.spaced_name as genre_spaced_name, genre.is_hidden as genre_is_hidden,
    subgenre.id as subgenre_id, subgenre.name as subgenre_name, subgenre.spaced_name as subgenre_spaced_name, subgenre.is_hidden as subgenre_is_hidden
  FROM subgenres as genre
  LEFT JOIN subgenres as subgenre
  ON genre.id = subgenre.parent_subgenre_id
  WHERE genre.parent_subgenre_id IS NULL
`

const groupSubgenres = rows => (
  rows.reduce((currGenres, nextRow) => {
    const existingGenreGroup = currGenres[nextRow.genre_name];
    const nextSubgenre = !!nextRow.subgenre_id ?
      {
        id: nextRow.subgenre_id,
        name: nextRow.subgenre_name,
        spacedName: nextRow.subgenre_spaced_name,
        isHidden: nextRow.subgenre_is_hidden
      } :
      null

    return {
      ...currGenres,
      [nextRow.genre_name]: !!existingGenreGroup ?
        {
          ...existingGenreGroup,
          subgenres: [
            ...existingGenreGroup.subgenres,
            nextSubgenre
          ].filter(s => !!s)
        } :
        {
          id: nextRow.genre_id,
          name: nextRow.genre_name,
          spacedName: nextRow.genre_spaced_name,
          isHidden: nextRow.genre_is_hidden,
          subgenres: [
            {
              id: nextRow.genre_id,
              name: nextRow.genre_name,
              spacedName: nextRow.genre_spaced_name,
              isHidden: nextRow.genre_is_hidden,
            },
            nextSubgenre
          ].filter(s => !!s)
        }
    }
  }, {})
)

router.get('/grouped', (req, res) => (
  database.query(groupedSubgenreQuery)
    .then(result => groupSubgenres(result.rows))
    .then(groupedGenres => res.json(groupedGenres))
));

module.exports = router;
