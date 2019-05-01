// TODO move control handlers into `shouldComponentUpdate` + plug into redux
// see 'audio-controls-cleanup' branch
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SoundCloudWidget from 'soundcloud-widget';
import { Howl } from 'howler';
import { find } from 'lodash';
import { playSong } from 'actions/player';

import './audio-manager.scss';

const PLAYER_DIV_ID = 'audio-manager-players';

const SOUNDCLOUD_PLAYER_TYPE = 'soundcloud';
const YOUTUBE_PLAYER_TYPE = 'youtube';
const HOWLER_PLAYER_TYPE = 'howler';

const SOUNDCLOUD_PLAYERS_ENABLED = true;
const YOUTUBE_PLAYERS_ENABLED = true;
const HOWLER_PLAYERS_ENABLED = true;

const getParentPlayerId = i => `song-player-song-${i}`;
const getYoutubePlayerId = i => `song-list-yt-player-${i}`;
const getSoundCloudPlayerId = i => `song-list-sc-player-${i}`;

const youtubeUrlPattern = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
const getSoundCloudUrl = scid => {
  const url = encodeURIComponent(`https://api.soundcloud.com/tracks/${scid}`)
  return `https://w.soundcloud.com/player/?url=${url}`;
}

const SONG_LOAD_WAIT_TIME = 1000;
const REPORT_DURATION_INTERVAL = 1000;

const MAX_SONG_LOADS = 1;

const SONG_BASE_URL = 'https://s3-us-west-1.amazonaws.com/rockwiththis/songs/'

const propTypes = {
  setActiveSongProgress: PropTypes.func.isRequired,
  onSongEnd: PropTypes.func.isRequired,
  playSong: PropTypes.func.isRequired,
  setSongDuration: PropTypes.func.isRequired
}

class AudioManager extends React.Component {
  constructor(props) {
    super(props);
    this.YT = undefined;
    this.activeSongs = {};
    this.songLoadQueue = [];
    this.loadingSongs = {};
    this.loadedPlayers = {};
    this.activePlayer = undefined;
    this.durationInterval = undefined;
    this.youtubeReadyCallback = () => this.YT = window.YT;
  }

  componentDidMount = () => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => this.youtubeReadyCallback();
  }

  shouldComponentUpdate = () => false;

  isSongLoadedOrLoading = song =>
    !!find(this.songLoadQueue, ['id', song.id]) ||
    !!this.loadedPlayers[song.id]

  isSongActive = song => !!find(this.activeSongs, ['id', song.id])

  setActiveSongs = songs => {

    // If youtube iframe api has not yet loaded, wait to load songs until ready
    if (!this.YT && YOUTUBE_PLAYERS_ENABLED) {
      this.youtubeReadyCallback = () => {
        this.YT = window.YT;
        this.setActiveSongs(songs)
      };
      return;
    }

    this.activeSongs = {};
    songs.forEach((song, i) => {
      this.activeSongs[song.id] = song;
      if (!this.isSongLoadedOrLoading(song)) this.songLoadQueue.push(song);
    })

    this.loadNextPlayers();

    Object.keys(this.loadedPlayers).forEach(songId => {
      if (!!this.loadedPlayers[songId] && !find(songs, ['id', parseInt(songId)])) {
        this.loadedPlayers[songId].unload();
        this.loadedPlayers[songId] = undefined;
      }
    })
  }

  shouldLoadMoreSongs = () =>
    Object.values(this.loadingSongs).filter(s => !!s).length < MAX_SONG_LOADS &&
    this.songLoadQueue.length > 0

  loadNextPlayers = () => {
    while (this.shouldLoadMoreSongs()) {
      const nextSong = this.songLoadQueue.shift();

      if (!!nextSong && this.isSongActive(nextSong) && !this.loadedPlayers[nextSong.id]) {
        this.loadingSongs[nextSong.id] = nextSong;
        this.loadedPlayers[nextSong.id] = this.createPlayer(nextSong);
      }
    }
  }

  createPlayer = (song, playOnLoad = false) => {
    if (!!song.soundcloud_track_id && SOUNDCLOUD_PLAYERS_ENABLED)
      return this.createSoundCloudPlayer(song, playOnLoad);

    else if ((!!song.youtube_link || !!song.youtube_track_id) && YOUTUBE_PLAYERS_ENABLED)
      return this.createYoutubePlayer(song, playOnLoad);

    else if (HOWLER_PLAYERS_ENABLED)
      return this.createHowlerPlayer(song, playOnLoad);

    console.log(`No player type available for song ${song.id}`);
    return null
  }

  getCleanPlayerElement = (elementTag, songId) => {
    const elementId = `song-player-${songId}`;
    if (document.getElementById(elementId))
      console.log("Hey, that element already exists ... expect funkiness (not the good kind)");

    const parentDiv = document.getElementById(PLAYER_DIV_ID);
    const playerDiv = document.createElement(elementTag);

    playerDiv.id = elementId;
    playerDiv.setAttribute('allow', 'autoplay');
    parentDiv.appendChild(playerDiv);

    return playerDiv;
  }

  createYoutubePlayer = (song, playOnLoad) => {
    const playerDiv = this.getCleanPlayerElement('div', song.id);
    const onReady = this.onPlayerReady(song, playOnLoad);
    const player = new this.YT.Player(playerDiv.id, {
      videoId: this.getYoutubeVideoId(song),
      playerVars: {
        playsinline: 1
      },
      events: {
        'onReady': onReady,
        'onStateChange': this.handleYoutubePlayerStateChange
      }
    });

    // TODO define this as a class
    return {
      song: song,
      type: YOUTUBE_PLAYER_TYPE,
      play: () => player.playVideo(),
      pause: () => player.pauseVideo(),
      stop: () => player.stopVideo(),
      reportProgress: () => (
        this.props.setActiveSongProgress({
          playedRatio: player.getCurrentTime() / player.getDuration(),
          playedSeconds: player.getCurrentTime()
        })
      ),
      fetchIsPlaying: () => Promise.resolve(player.getPlayerState() === 1),
      fetchDuration: () => Promise.resolve(player.getDuration()),
      seekTo: ratio => player.seekTo(ratio * player.getDuration(), true),
      unload: () => player.destroy(),
      setOnReadyHandler: onReady => {
        // Idk if this will actually work
        player.removeEventListener('onReady', 'onReady');
        player.addEventListener('onReady', onReady);
      }
    };
  }

  getYoutubeVideoId = song => {
    if (!!song.youtube_link) {
      const match = song.youtube_link.match(youtubeUrlPattern);
      if (!!match) return match[1]
    }
    return song.youtube_id;
  }

  handleYoutubePlayerStateChange = changeEvent =>
    changeEvent.data === 0 && this.props.onSongEnd();

  createSoundCloudPlayer = (song, playOnLoad) => {
    const playerElement = this.getCleanPlayerElement('iframe', song.id);
    playerElement.setAttribute("src", getSoundCloudUrl(song.soundcloud_track_id));

    const player = new SoundCloudWidget(playerElement);
    player.bind(SoundCloudWidget.events.READY, this.onPlayerReady(song));
    player.bind(SoundCloudWidget.events.FINISH, this.props.onSongEnd);

    // TODO define this as a class
    return {
      song: song,
      type: SOUNDCLOUD_PLAYER_TYPE,
      play: () => player.play(),
      pause: () => player.pause(),
      stop: () => {
        player.pause();
        player.seekTo(0);
      },
      reportProgress: () => (
        player.getPosition().then(position => (
          player.getDuration().then(duration => (
            this.props.setActiveSongProgress({
              playedRatio: position / duration,
              playedSeconds: position / 1000
            })
          ))
        ))
      ),
      fetchIsPlaying: () => player.isPaused(),
      fetchDuration: () => player.getDuration().then(milis => milis / 1000),
      seekTo: ratio => player.getDuration().then(milis => player.seekTo(ratio * milis)),
      // Idk if this will actually work
      unload: () => playerElement.remove(),
      setOnReadyHandler: onReady => {
        player.unbind(SoundCloudWidget.events.READY);
        player.bind(SoundCloudWidget.events.READY, onReady);
      }
    };
  }

  createHowlerPlayer = (song, playOnLoad) => {
    const player = new Howl({
      src: [SONG_BASE_URL + encodeURI(song.song_file_name)],
      html5: true,
      autoplay: false,
      onload: this.onPlayerReady(song, playOnLoad),
      onend: this.props.onSongEnd,
    })

    // TODO define this as a class
    return {
      song: song,
      type: HOWLER_PLAYER_TYPE,
      play: () => player.play(),
      pause: () => player.pause(),
      stop: () => player.stop(),
      reportProgress: () => {
        if (typeof player.seek() === 'number') {
          this.props.setActiveSongProgress({
            playedRatio: player.seek() / player.duration(),
            playedSeconds: player.seek()
          });
        }
      },
      fetchIsPlaying: () => Promise.resolve(player.playing()),
      fetchDuration: () => Promise.resolve(player.duration()),
      seekTo: ratio => player.seek(player.duration() * ratio),
      unload: () => player.unload(),
      setOnReadyHandler: onReady => {
        player.off('load');
        player.on('load', onReady);
      }
    }
  }

  onPlayerReady = (song, playSong) => () => {
    if (!!this.loadedPlayers[song.id]) {
      this.activePlayer = this.activePlayer || this.loadedPlayers[song.id];
      this.loadedPlayers[song.id].fetchDuration().then(duration => {
        if (playSong) {
          this.props.playSong(song, duration);
        } else {
          // TODO are we sure we don't need to set this *every* time?
          this.props.setSongDuration(song.id, duration);
        }
      })
    }
    this.loadingSongs[song.id] = undefined;
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

  // This does not work w/ embedded media on some browsers
  loadAndPlaySong = song => {
    if (!!this.loadingSongs[song.id]) {
      this.loadedPlayers[song.id].setOnReadyHandler(this.onPlayerReady(song, true));
    }
    else if (!!this.loadedPlayers[song.id]) {
      this.onPlayerReady(song, true)();
    } else {
      this.loadedPlayers[song.id] = this.createPlayer(song, true);
    }
  }

  reportActivePlayerProgress = () => this.activePlayer.reportProgress()

  updateSongProgress = progressRatio => {
    this.activePlayer.seekTo(progressRatio);
    this.reportActivePlayerProgress();
  }

  fetchIsActivePlayerPlaying = () => this.activePlayer.fetchIsPlaying();

  getPlayer = song => this.loadedPlayers[song.id]

  render = () => <div id={PLAYER_DIV_ID}></div>;
}

AudioManager.propTypes = propTypes;

export default AudioManager;
