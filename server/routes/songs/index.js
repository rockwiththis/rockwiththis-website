const express = require('express');
const router = express.Router();
const database = require('../../db');

const nestResultingSongsWithGenres = (songs) => {
  let result = [];
  let first = { genre_id, genre_name, ...initialSong } = songs[0];
  let currentSong = initialSong;

  for (let i = 0; i < songs.length; i++) {
    if (currentSong.id != songs[i].id) {
      result.push(currentSong)
      const clone = { genre_id, genre_name, ...cloned_song } = songs[i];
      currentSong = cloned_song;
    }

    const genre = {
      id: songs[i].genre_id,
      name: songs[i].genre_name
    };

    if (!currentSong.sub_genres) {
      currentSong.sub_genres = [genre];
    } else {
      currentSong.sub_genres.push(genre);
    }
  }

  result.push(currentSong)
  return result;
}



// router.get('/', (req, res) => {
//   database.query(`
//     SELECT subgenres.id as genre_id, subgenres.name as genre_name, songs.*
//     FROM songs
//     JOIN subgenre_songs
//     ON songs.id = subgenre_songs.song_id
//     JOIN subgenres
//     ON subgenres.id = subgenre_songs.subgenre_id
//     ORDER by songs.created_at desc`
//   )
//   .then(result => {
//     // console.log(result.rows);
//     const songsWithSubGenres = nestResultingSongsWithGenres(result.rows);
//     res.json(songsWithSubGenres);
//   });
// });


router.get('/', (req, res) => {
  database.query(`
    SELECT subgenres.id as genre_id, subgenres.name as genre_name, songs.*
    FROM songs
    JOIN subgenre_songs
    ON songs.id = subgenre_songs.song_id
    JOIN subgenres
    ON subgenres.id = subgenre_songs.subgenre_id
    ORDER by songs.created_at desc
    LIMIT 40`
  )
  .then(result => {
    // console.log(result.rows);
    const songsWithSubGenres = nestResultingSongsWithGenres(result.rows);
    res.json(songsWithSubGenres);
  });
});





const nestSingleSongWithGenres = (songs) => {
  let result = [];
  let first = { genre_id, genre_name, ...initialSong } = songs[0];
  let currentSong = initialSong;

  for (let i = 0; i < songs.length; i++) {
    if (currentSong.id != songs[i].id) {
      result.push(currentSong)
      const clone = { genre_id, genre_name, ...cloned_song } = songs[i];
      currentSong = cloned_song;
    }

    const genre = {
      id: songs[i].genre_id,
      name: songs[i].genre_name
    };

    if (!currentSong.sub_genres) {
      currentSong.sub_genres = [genre];
    } else {
      currentSong.sub_genres.push(genre);
    }
  }
  result.push(currentSong)
  return result;
}


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
