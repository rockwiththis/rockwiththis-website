import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SoundCloudWidget from 'soundcloud-widget';
import { Howl } from 'howler';
import { find, uniqBy } from 'lodash';

import { playSong, playerBankUpdated } from 'actions/player';
import { setLoadedPlayerDuration, setActiveSongProgress } from 'actions/set-state';

const PLAYER_DIV_ID = 'audio-manager';

const SOUNDCLOUD_PLAYER_TYPE = 'soundcloud';
const YOUTUBE_PLAYER_TYPE = 'youtube';
const HOWLER_PLAYER_TYPE = 'howler';

const SOUNDCLOUD_PLAYERS_ENABLED = true;
const YOUTUBE_PLAYERS_ENABLED = true;
const HOWLER_PLAYERS_ENABLED = false;

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
const AUTOPLAY_CHECK_INTERVAL = 2000;

const MAX_SONG_LOADS = 1;

const SONG_BASE_URL = 'https://s3-us-west-1.amazonaws.com/rockwiththis/songs/'

class AudioManager extends React.Component {

  static propTypes = {
    reportAutoplayFailure: PropTypes.func.isRequired,

    // redux
    isPlaying: PropTypes.bool.isRequired,
    songData: PropTypes.exact({
      active: PropTypes.object.isRequired,
      nextUp: PropTypes.object,
      newest: PropTypes.array.isRequired,
      filtered: PropTypes.array.isRequired,
      spotlight: PropTypes.object.isRequired,
      single: PropTypes.object.isRequired,
      playable: PropTypes.array.isRequired,
      priority: PropTypes.array.isRequired
    }).isRequired,
    shouldLoadPlayers: PropTypes.bool,
    playSong: PropTypes.func.isRequired,
    setLoadedPlayerDuration: PropTypes.func.isRequired,
    setActiveSongProgress: PropTypes.func.isRequired,
    playerBankUpdated: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.YT = window.YT;
    this.activeSongs = {};
    this.songLoadQueue = [];
    this.loadingPlayers = {};
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

  // This is where we will handle prop changes that control playing / loading songs
  // Always return `false` to prevent re-rendering
  shouldComponentUpdate = nextProps => {
    // Doing this so dev page re-render uses already-loaded YT script
    this.YT = this.YT || window.YT

    if (!nextProps.isPlaying && this.props.isPlaying) {
      this.pauseActiveSong();
    }

    if (this.props.songData.active.id !== nextProps.songData.active.id && nextProps.isPlaying) {
      this.playSongListSong(nextProps.songData.active);

    } else if (nextProps.isPlaying && !this.props.isPlaying) {
      this.playActiveSong();

    } else if (!!nextProps.nextUp) {
      this.loadAndPlaySong(nextProps.nextUp)
    }

    if (nextProps.shouldLoadPlayers) {
      this.setActiveSongs(
        this.uniqueSongs(nextProps.songData.playable)
      );
      this.props.playerBankUpdated();
    }

    if (nextProps.shouldPrioritizePlayers) {
      this.prioritizeAndLoadSongs(
        this.uniqueSongs(nextProps.songData.priority)
      );
      this.props.playerBankUpdated();
    }

    return false;
  };

  playNextSong = (isAutoplay = false) => () => {
    const nextIndex = this.props.filteredPosts.findIndex(song => song.id === this.props.songData.active.id) + 1;

    if (nextIndex >= this.props.filteredPosts.length) {
      this.props.loadMoreSongs()
        .then(newSongs => this.props.playSong(newSongs[0]));

    } else {
      this.props.playSong(this.props.filteredPosts[nextIndex]);
    }

    if (isAutoplay) setTimeout(this.checkAutoplayStatus, AUTOPLAY_CHECK_INTERVAL);
  }

  checkAutoplayStatus = () =>
    fetchIsActivePlayerPlaying().then(isPlaying => {
      if (!isPlaying) this.props.reportAutoplayFailure();
    });

  uniqueSongs = songs => uniqBy(songs, s => s.id).filter(s => !!s.id)

  isSongLoadedOrLoading = song =>
    !!find(this.songLoadQueue, ['id', song.id]) ||
    !!this.loadedPlayers[song.id] ||
    !!this.loadingPlayers[song.id]

  isSongActive = song => !!find(this.activeSongs, ['id', song.id])

  setActiveSongs = songs => {

    // If youtube iframe api has not yet loaded, wait to load songs until ready
    if (!this.YT && YOUTUBE_PLAYERS_ENABLED) {
      this.youtubeReadyCallback = () => {
        this.YT = window.YT;
        this.setActiveSongs(songs);
      };
      return;
    }

    this.activeSongs = {};
    songs.forEach(song => {
      this.activeSongs[song.id] = song;
      if (!this.isSongLoadedOrLoading(song)) this.songLoadQueue.push(song);
    })

    this.loadNextPlayers();

    Object.keys(this.loadedPlayers).forEach(songId => {
      if (!!this.loadedPlayers[songId] && !this.activeSongs[parseInt(songId)]) {
        this.loadedPlayers[songId].unload();
        this.loadedPlayers[songId] = undefined;
      }
    })
  }

  prioritizeSongs = songs =>
    songs.forEach(song => {
      this.activeSongs[song.id] = song;
      if (!this.isSongLoadedOrLoading(song)) this.songLoadQueue.unshift(song);
    });

  prioritizeAndLoadSongs = songs => {
    this.prioritizeSongs(songs);
    this.loadNextPlayers();
  }

  shouldLoadMoreSongs = () =>
    Object.values(this.loadingPlayers).filter(s => !!s).length < MAX_SONG_LOADS &&
    this.songLoadQueue.length > 0

  loadNextPlayers = () => {
    while (this.shouldLoadMoreSongs()) {
      const nextSong = this.songLoadQueue.shift();

      if (!!nextSong && this.isSongActive(nextSong) && !this.loadedPlayers[nextSong.id]) {
        this.loadingPlayers[nextSong.id] = this.createPlayer(nextSong);
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
    const player = new this.YT.Player(playerDiv.id, {
      videoId: this.getYoutubeVideoId(song),
      playerVars: {
        playsinline: 1
      },
      events: {
        'onReady': this.onPlayerReady(song),
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
      playOnLoad
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
    changeEvent.data === 0 && this.playNextSong();

  createSoundCloudPlayer = (song, playOnLoad) => {
    const playerElement = this.getCleanPlayerElement('iframe', song.id);
    playerElement.setAttribute("src", getSoundCloudUrl(song.soundcloud_track_id));

    const player = new SoundCloudWidget(playerElement);
    player.bind(SoundCloudWidget.events.READY, this.onPlayerReady(song));
    player.bind(SoundCloudWidget.events.FINISH, this.playNextSong);

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
      fetchIsPlaying: () => player.isPaused().then(isPaused => !isPaused),
      fetchDuration: () => player.getDuration().then(milis => milis / 1000),
      seekTo: ratio => player.getDuration().then(milis => player.seekTo(ratio * milis)),
      // Idk if this will actually work
      unload: () => playerElement.remove(),
      playOnLoad
    };
  }

  createHowlerPlayer = (song, playOnLoad) => {
    const player = new Howl({
      src: [SONG_BASE_URL + encodeURI(song.song_file_name)],
      html5: true,
      autoplay: false,
      onload: this.onPlayerReady(song),
      onend: this.playNextSong,
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
      playOnLoad
    }
  }

  onPlayerReady = song => () => {
    const readyPlayer = this.loadingPlayers[song.id];
    if (!!readyPlayer) {
      this.loadedPlayers[song.id] = readyPlayer;
      this.activePlayer = this.activePlayer || readyPlayer;

      readyPlayer.fetchDuration().then(duration => {
        if (readyPlayer.playOnLoad) {
          this.props.playSong(song, duration);
        } else {
          this.props.setLoadedPlayerDuration({
            songId: song.id,
            durationSeconds: duration
          });
        }
      })
    }
    this.loadingPlayers[song.id] = undefined;
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

    if (!!this.loadingPlayers[song.id]) {
      // song currently being loaded - mark to play automatically when finished
      this.loadingPlayers[song.id].playOnLoad = true;

    } else if (!!this.loadedPlayers[song.id]) {
      // song already loaded - add loaded player to loading queue and report as loaded immediately
      this.loadingPlayers[song.id] = this.loadedPlayers[song.id];
      this.loadedPlayers[song.id] = undefined;
      this.onPlayerReady(song)();

    } else {
      // song not started loading - create player that will play on load
      this.loadingPlayers[song.id] = this.createPlayer(song, true);
    }
  }

  reportActivePlayerProgress = () => this.activePlayer.reportProgress()

  updateSongProgress = progressRatio => {
    this.activePlayer.seekTo(progressRatio);
    this.reportActivePlayerProgress();
  }

  fetchIsActivePlayerPlaying = () => this.activePlayer.fetchIsPlaying();

  getPlayer = song => this.loadedPlayers[song.id]

  render = () => (
      <div id={ PLAYER_DIV_ID } className="audio-manager">
        <style jsx>{`
          .audio-manager {
            opacity: 0 !important;
            position: fixed;
          }
        `}</style>
      </div>
  )
}

const stateToProps = ({
  isPlaying,
  activeSong,
  nextSong,
  heroPosts,
  filteredPosts,
  spotlightPost,
  singleSongPost,
  shouldLoadPlayers
}) => ({
  isPlaying,
  songData: {
    active: activeSong,
    nextUp: nextSong,
    newest: heroPosts,
    filtered: filteredPosts,
    spotlight: spotlightPost,
    single: singleSongPost,
    playable: [activeSong, singleSongPost, ...heroPosts, ...filteredPosts, spotlightPost],
    priority: [singleSongPost, spotlightPost]
  },
  shouldLoadPlayers
})

const actions = {
  playSong,  // for autoplay
  setLoadedPlayerDuration,
  setActiveSongProgress,
  playerBankUpdated
}

export default connect(
  stateToProps,
  actions
)(AudioManager);
