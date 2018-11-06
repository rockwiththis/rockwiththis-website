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

  return result;
}



router.get('/', (req, res) => {
  database.query(`
    SELECT subgenres.id as genre_id, subgenres.name as genre_name, songs.*
    FROM songs
    JOIN subgenre_songs
    ON songs.id = subgenre_songs.song_id
    JOIN subgenres
    ON subgenres.id = subgenre_songs.subgenre_id
    ORDER by songs.id`
  )
  .then(result => {
    console.log(result.rows);
    const songsWithSubGenres = nestResultingSongsWithGenres(result.rows);
    res.json(songsWithSubGenres);
  });
});






const nestSingleSongWithGenres = (song) => {
  let result = [];
  let first = { genre_id, genre_name, ...initialSong } = song;
  let currentSong = initialSong;

      result.push(currentSong)
      const clone = { genre_id, genre_name, ...cloned_song } = song;
      currentSong = cloned_song;


    const genre = {
      id: song.genre_id,
      name: song.genre_name
    };

    if (!currentSong.sub_genres) {
      currentSong.sub_genres = [genre];
    } else {
      currentSong.sub_genres.push(genre);
    }


  return result;
}


router.get('/:id', (req, res) => {

  var singleSongId = parseInt(req.params.id);


  database.query("SELECT * FROM songs WHERE id = " + singleSongId)
    .then(results => {
      return res.json(result.rows);
    })
})
// router.get('/:id', (req, res) => {
//
//   var singleSongId = parseInt(req.params.id);
//
//
//   database.query("SELECT * FROM songs WHERE id = " + singleSongId)
//     .then(results => {
//       console.log(result.rows);
//
//       const singleSongWithSubGenres = nestSingleSongWithGenres(result.rows);
//
//
//       return res.json(singleSongWithSubGenres);
//     })
// })




module.exports = router;
