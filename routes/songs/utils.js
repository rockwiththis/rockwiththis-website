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

  result.push(currentSong);
  return result.sort((a, b) => {
    let first = new Date(a.created_at);
    let second = new Date(b.created_at);

    if (first > second) {
        return -1;
    } else if (second == first) {
        return 0;
    } else {
        return 1;
    }
  });
};

module.exports = {
  nestSingleSongWithGenres,
  nestResultingSongsWithGenres,
};
