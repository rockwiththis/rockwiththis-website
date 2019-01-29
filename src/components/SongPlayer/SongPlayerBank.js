// react gods please forgive me for i have sinned...

import React from 'react';
import SoundCloudWidget from 'soundcloud-widget';
import { Howl } from 'howler';

import './SongPlayerBank.scss';

const getParentPlayerId = i => `song-player-song-${i}`;
const getYoutubePlayerId = i => `song-list-yt-player-${i}`;
const getSoundcloudPlayerId = i => `song-list-sc-player-${i}`;

const youtubeUrlPattern = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
const getSoundCloudUrl = scid => {
  const url = encodeURIComponent(`https://api.soundcloud.com/tracks/${scid}`)
  return `https://w.soundcloud.com/player/?url=${url}`;
}

const REPORT_DURATION_INTERVAL = 1000;

const SONG_BASE_URL = 'https://s3-us-west-1.amazonaws.com/rockwiththis/songs/'

class SongPlayerBank extends React.Component {
  constructor(props) {
    super(props);
    this.songListPlayers = undefined;
    this.heroPlayers = undefined;
    this.allPlayers = undefined;
    this.activePlayer = undefined;
    this.durationInterval = undefined;
  }

  shouldComponentUpdate = () => false;

  componentDidMount = () => {
    this.heroPlayers = this.props.heroSongs.reduce((currPlayers, song, i) => ({
      ...currPlayers,
      [song.id]: this.createPlayer(song, i)
    }), {});
    this.setSongListPlayers(this.props.initialSongList);
    this.activePlayer = this.allPlayers[this.props.initialActiveSong.id];
  }

  setSongListPlayers = (songList, snapshotSong) => {
    const activeIndex = !!this.activePlayer ? this.activePlayer.index : null;
    const snapshotIndex = !!snapshotSong && this.allPlayers[snapshotSong.id] && this.allPlayers[snapshotSong.id].index
    var indexOffset = this.props.heroSongs.length;

    this.songListPlayers = songList.reduce((currPlayers, song, i) => {
      const currIndex = i + indexOffset;

      if (!!this.heroPlayers[song.id]) {
        indexOffset -= 1;
        return currPlayers

      } else if (currIndex === activeIndex) {
        indexOffset += 1;
        return {
          ...currPlayers,
          [this.activePlayer.songId]: this.activePlayer,
          [song.id]: this.createPlayer(song, currIndex + 1)
        }

      } else if (currIndex === snapshotIndex) {
        indexOffset += 1;
        return {
          ...currPlayers,
          [snapshotSong.id]: this.allPlayers[snapshotSong.id],
          [song.id]: this.createPlayer(song, currIndex + 1)
        }

      } else {
        return {
          ...currPlayers,
          [song.id]: this.createPlayer(song, currIndex)
        }
      }
    }, {});

    this.allPlayers = { ...this.heroPlayers, ...this.songListPlayers }
  }

  createPlayer = (song, index) =>
    new Howl({
      src: [SONG_BASE_URL + encodeURI(song.song_file_name)],
      html5: true,
      autoplay: false,
      onload: this.onPlayerReady(song.id),
      onend: this.props.onSongEnd
    });

  onPlayerReady = songId => () =>
    this.allPlayers[songId] &&
    this.props.setSongDuration(songId, this.allPlayers[songId].duration())

  playSongListSong = songToPlay => {
    const newActivePlayer = this.allPlayers[songToPlay.id];
    if (!!newActivePlayer) {
      newActivePlayer.play();

      if (!!this.activePlayer) {
        clearInterval(this.durationInterval);
        this.activePlayer.stop();
      }
      this.activePlayer = newActivePlayer;
      this.durationInterval = setInterval(this.reportActivePlayerProgress, REPORT_DURATION_INTERVAL);
    }
    // TODO handle undefined player data
  }

  playActiveSong = () => {
    this.activePlayer.play();
    this.durationInterval = setInterval(this.reportActivePlayerProgress, REPORT_DURATION_INTERVAL);
  }

  pauseActiveSong = () => {
    this.activePlayer.pause();
    clearInterval(this.durationInterval);
  }

  reportActivePlayerProgress = () =>
    this.props.setActiveSongProgress({
      playedRatio: this.activePlayer.seek() / this.activePlayer.duration(),
      playedSeconds: this.activePlayer.seek()
    });

  updateSongProgress = progressRatio => {
    this.activePlayer.seek(this.activePlayer.duration() * progressRatio);
    this.reportActivePlayerProgress();
  }

  render = () => <div className="song-player-bank"></div>;
}

export default SongPlayerBank;
