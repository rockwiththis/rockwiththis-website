import {
  SONG_LOADING,
  SONG_READY,
  SONG_PLAYING,
  SONG_PAUSED
} from 'constants/song-player-statuses';

export default function(songData, playerState) {
  if (songData.id)
    return {
      status: getSongStatus(songData.id, playerState),
      play: () => playerState.playSong(songData),
      pause: () => playerState.pauseSong()
    }
  else
    return DEFAULT_PLAYER
}

const getSongStatus = (songId, { activeSong, isPlaying, songPlayerDurations }) => {
  if (isPlaying && songId === activeSong.id)
    return SONG_PLAYING;

  else if (!songPlayerDurations[songId])
    return SONG_LOADING;

  else if (songId === activeSong.id)
    return SONG_PAUSED;

  else
    return SONG_READY;
};

const DEFAULT_PLAYER = {
  status: SONG_LOADING,
  play: () => console.log("invalid player object"),
  pause: () => console.log("invalid player object")
}
