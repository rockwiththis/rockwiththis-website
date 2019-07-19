import {
  SONG_LOADING,
  SONG_READY,
  SONG_PLAYING,
  SONG_PAUSED
} from 'constants/song-player-statuses';

export default function(song, { activeSong, isPlaying, songPlayerDurations }) {

  if (isPlaying && song.id === activeSong.id)
    return SONG_PLAYING;

  else if (song.id === activeSong.id)
    return SONG_PAUSED;

  else if (!!songPlayerDurations[song.id])
    return SONG_READY;

  else
    return SONG_LOADING;
}
