// react gods please forgive me for i have sinned...

import React from 'react';
import SoundCloudWidget from 'soundcloud-widget';
import { Howl } from 'howler';
import { find } from 'lodash';

import './SongPlayerBank.scss';

const getParentPlayerId = i => `song-player-song-${i}`;
const getYoutubePlayerId = i => `song-list-yt-player-${i}`;
const getSoundcloudPlayerId = i => `song-list-sc-player-${i}`;

const youtubeUrlPattern = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
const getSoundCloudUrl = scid => {
  const url = encodeURIComponent(`https://api.soundcloud.com/tracks/${scid}`)
  return `https://w.soundcloud.com/player/?url=${url}`;
}

const SONG_LOAD_WAIT_TIME = 1000;
const REPORT_DURATION_INTERVAL = 1000;

const MAX_SONG_LOADS = 4;

const SONG_BASE_URL = 'https://s3-us-west-1.amazonaws.com/rockwiththis/songs/'

class SongPlayerBank extends React.Component {
  constructor(props) {
    super(props);
    this.activeSongs = {};
    this.songLoadQueue = [];
    this.loadingSongs = {};
    this.loadedPlayers = {};
    this.activePlayer = undefined;
    this.durationInterval = undefined;
  }

  shouldComponentUpdate = () => false;

  isSongLoadedOrLoading = song =>
    !!find(this.songLoadQueue, ['id', song.id]) ||
    !!this.loadedPlayers[song.id]

  isSongActive = song => !!find(this.activeSongs, ['id', song.id])

  shouldLoadMoreSongs = () =>
    Object.values(this.loadingSongs).filter(s => !!s).length < MAX_SONG_LOADS &&
    this.songLoadQueue.length > 0

  setActiveSongs = songs => {
    this.activeSongs = {};
    songs.forEach((song, i) => {
      this.activeSongs[song.id] = song;
      if (!this.isSongLoadedOrLoading(song)) this.songLoadQueue.push(song);
    })

    this.loadNextPlayers();

    Object.keys(this.loadedPlayers).forEach(songId => {
      if (!find(songs, ['id', parseInt(songId)])) {
        this.loadedPlayers[songId].unload();
        this.loadedPlayers[songId] = undefined;
      }
    })
  }

  loadNextPlayers = () => {
    while (shouldLoadMoreSongs()) {
      const nextSong = this.songLoadQueue.shift();

      if (!!nextSong && this.isSongActive(nextSong)) {
        this.loadingSongs[nextSong.id] = nextSong;
        this.loadedPlayers[nextSong.id] = (
          this.loadedPlayers[nextSong.id] ||
          this.createPlayer(nextSong)
        );
      }
    }
  }

  createPlayer = song =>
    new Howl({
      src: [SONG_BASE_URL + encodeURI(song.song_file_name)],
      html5: true,
      autoplay: false,
      onload: this.onPlayerReady(song.id),
      onend: this.props.onSongEnd,
    })

  onPlayerReady = songId => () => {
    if (!!this.loadedPlayers[songId]) {
      this.activePlayer = this.activePlayer || this.loadedPlayers[songId];
      this.props.setSongDuration(songId, this.loadedPlayers[songId].duration());
    }
    this.loadingSongs[songId] = undefined;
    this.loadNextPlayers();
  }

  playSongListSong = songToPlay => {
    const newActivePlayer = this.loadedPlayers[songToPlay.id];
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
