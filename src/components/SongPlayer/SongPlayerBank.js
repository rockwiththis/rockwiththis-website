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
      [song.id]: this.createPlayer(song)
    }), {});
    this.allPlayers = { ...this.heroPlayers };

    //setTimeout(() => {
      this.setSongListPlayers(this.props.initialSongList);
      this.activePlayer = this.allPlayers[this.props.initialActiveSong.id];
    //}, 5000);
  }

  setSongListPlayers = songList => {
    this.songListPlayers = songList.reduce((currPlayers, song) => (
        !!song.id ?
          {
            ...currPlayers,
            [song.id]: this.allPlayers[song.id] || this.createPlayer(song)
          } :
          currPlayers
    ), {});
    this.allPlayers = { ...this.allPlayers, ...this.songListPlayers }
  }

  ensureActivePlayer = activeSong => {
    // Verify that `activePlayer` is set correctly ... useful for navigation to single song page
    if (!!this.allPlayers[activeSong.id]) {
      this.activePlayer = this.allPlayers[activeSong.id];
    } else {
      this.activePlayer = this.createPlayer(activeSong);
      this.allPlayers = {
        ...this.allPlayers,
        [activeSong.id]: this.activePlayer
      };
    }
  }

  createPlayer = song => setTimeout(() => (
    new Howl({
      src: [SONG_BASE_URL + encodeURI(song.song_file_name)],
      html5: false,
      autoplay: false,
      onload: this.onPlayerReady(song.id),
      onend: this.props.onSongEnd
    })
  ), 1000)

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

  reportActivePlayerProgress = () => {
    if (typeof this.activePlayer.seek() === 'number') {
      this.props.setActiveSongProgress({
        playedRatio: this.activePlayer.seek() / this.activePlayer.duration(),
        playedSeconds: this.activePlayer.seek()
      });
    }
  }

  updateSongProgress = progressRatio => {
    this.activePlayer.seek(this.activePlayer.duration() * progressRatio);
    this.reportActivePlayerProgress();
  }

  render = () => <div className="song-player-bank"></div>;
}

export default SongPlayerBank;
