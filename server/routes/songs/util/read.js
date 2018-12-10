const getSongsQuery = (limit, offset, subgenreIds) => {

  const subgenreIdFilter = (
    subgenreIds.length > 0  ? `WHERE subgenres.id IN (${subgenreIds})` : ''
  );
  const offsetStatement = `OFFSET ${Number(offset)}`;
  const limitStatement = `LIMIT ${Number(limit)}`;

  const queryText = (`
    SELECT DISTINCT songs.*
    FROM songs
    JOIN subgenre_songs
    ON songs.id = subgenre_songs.song_id
    JOIN subgenres
    ON subgenres.id = subgenre_songs.subgenre_id
    ${subgenreIdFilter}
    ORDER BY songs.created_at DESC, songs.id
    ${limitStatement}
    ${offsetStatement}
  `);

  return { text: queryText };
}

const getSongsSubgenresQuery = (songIds) => {

  const queryText = (`
    SELECT songs.id as song_id, subgenres.*
    FROM songs
    JOIN subgenre_songs
    ON songs.id = subgenre_songs.song_id
    JOIN subgenres
    ON subgenres.id = subgenre_songs.subgenre_id
    WHERE songs.id IN (${songIds})
    ORDER BY songs.id
  `);

  return { text: queryText };
}

const nestSongsWithSubgenres = (songs, subgenres) => {
  const keyedSubgenres = getSubgenresBySongId(subgenres);
  return songs.map(song => ({
    ...song,
    sub_genres: keyedSubgenres[song.id]
  }));
}

const getSubgenresBySongId = subgenreRows => (
  subgenreRows.reduce((keyedSubgenres, nextSubgenreRow) => ({
    ...keyedSubgenres,
    [nextSubgenreRow.song_id]: (keyedSubgenres[nextSubgenreRow.song_id] || []).concat([nextSubgenreRow])
  }), {})
);

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

module.exports = {
  getSongsQuery,
  getSongsSubgenresQuery,
  nestSongsWithSubgenres,
  nestSingleSongWithGenres
};
