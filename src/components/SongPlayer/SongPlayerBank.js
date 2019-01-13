// react gods please forgive me for i have sinned...

import React from 'react';
import SoundCloudWidget from 'soundcloud-widget';

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

class SongPlayerBank extends React.Component {
  constructor(props) {
    super(props);
    this.YT = undefined;
    this.songListPlayers = undefined;
    this.heroPlayers = undefined;
    this.allPlayers = undefined;
    this.activePlayer = undefined;
    this.durationInterval = undefined;
  }

  shouldComponentUpdate = () => false;

  componentDidMount = () => {
    this.loadYoutubeIframeApi()
    .then(YT => {
      this.YT = YT;
      this.heroPlayers = this.props.heroSongs.reduce((currPlayers, song, i) => ({
        ...currPlayers,
        [song.id]: this.createPlayer(song, i)
      }), {})
      this.setSongListPlayers(this.props.initialSongList);
      this.activePlayer = this.allPlayers[this.props.initialActiveSong.id];
    })
  }

  loadYoutubeIframeApi = () => (
      new Promise(resolve => {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        window.onYouTubeIframeAPIReady = () => resolve(window.YT)
      })
  )

  setSongListPlayers = (songList, snapshotSong) => {
    const activeIndex = !!this.activePlayer ? this.activePlayer.index : null;
    const snapshotIndex = !!snapshotSong && this.allPlayers[snapshotSong.id] && this.allPlayers[snapshotSong.id].index
    var indexOffset = this.props.heroSongs.length;
    console.log("set new song list", songList);
    console.log(activeIndex);
    console.log(snapshotIndex);

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

  createPlayer = (song, index) => {
    console.log(`Song ${song.id} @ index ${index}`);
      return !!song.soundcloud_track_id ?
        this.createSoundCloudPlayer(song, index) :
        this.createYoutubePlayer(song, index)
  }

  getCleanPlayerElement = (index, elementType, getId) => {
    const parentDiv = document.getElementById(getParentPlayerId(index));
    parentDiv.innerHTML = '';

    const playerDiv = document.createElement(elementType);
    playerDiv.id = getId(index);
    parentDiv.appendChild(playerDiv);

    return playerDiv;
  }

  createYoutubePlayer = (song, index) => {
    const playerDiv = this.getCleanPlayerElement(index, 'div', getYoutubePlayerId);
    const player = new this.YT.Player(playerDiv.id, {
      videoId: song.youtube_link.match(youtubeUrlPattern)[1],
      playerVars: {
        playsinline: 1
      },
      events: {
        'onReady': this.onPlayerReady(song.id),
        'onStateChange': this.handleYoutubePlayerStateChange
      }
    });
    return {
      index: index,
      songId: song.id,
      play: () => player.playVideo(),
      pause: () => player.pauseVideo(),
      reportProgress: () => (
          this.props.setActiveSongProgress({
            playedRatio: player.getCurrentTime() / player.getDuration(),
            playedSeconds: player.getCurrentTime()
          })
      ),
      getDuration: () => Promise.resolve(player.getDuration()),
      seekTo: ratio => player.seekTo(ratio * player.getDuration(), true)
    };
  }

  handleYoutubePlayerStateChange = changeEvent => (
      changeEvent.data === 0 && this.props.onSongEnd
  )

  createSoundCloudPlayer = (song, index) => {
    const playerDiv = this.getCleanPlayerElement(index, 'iframe', getSoundcloudPlayerId);
    playerDiv.setAttribute("src", getSoundCloudUrl(song.soundcloud_track_id));

    const player = new SoundCloudWidget(playerDiv);
    player.bind(SoundCloudWidget.events.READY, this.onPlayerReady(song.id));
    player.bind(SoundCloudWidget.events.FINISH, this.props.onSongEnd);

    return {
      index: index,
      songId: song.id,
      play: () => player.play(),
      pause: () => player.pause(),
      reportProgress: () => (
        player.getPosition()
        .then(position => (
            player.getDuration()
            .then(duration => (
                this.props.setActiveSongProgress({
                  playedRatio: position / duration,
                  playedSeconds: position / 1000
                })
            ))
        ))
      ),
      getDuration: () => player.getDuration().then(milis => milis / 1000),
      seekTo: ratio => player.getDuration().then(milis => player.seekTo(ratio * milis))
    };
  }

  onPlayerReady = songId => ref => {
    console.log("loaded song", songId);
    this.allPlayers[songId].getDuration()
    .then(seconds => this.props.setSongDuration(songId, seconds))
  }

  updateSongProgress = progressRatio => this.activePlayer.seekTo(progressRatio);

  playSongListSong = songToPlay => {
    const newActivePlayer = this.allPlayers[songToPlay.id];
    console.log("playing song", newActivePlayer);
    if (!!newActivePlayer) {
      newActivePlayer.play();

      if (!!this.activePlayer) {
        clearInterval(this.durationInterval);
        this.activePlayer.seekTo(0);
        this.activePlayer.pause();
      }
      this.activePlayer = newActivePlayer;
      this.durationInterval = setInterval(this.activePlayer.reportProgress, REPORT_DURATION_INTERVAL);
    }
    // TODO handle undefined player data
  }

  playActiveSong = () => {
    this.activePlayer.play();
    this.durationInterval = setInterval(this.activePlayer.reportProgress, REPORT_DURATION_INTERVAL);
  }

  pauseActiveSong = () => {
    this.activePlayer.pause();
    clearInterval(this.durationInterval);
  }

  render = () => {
    const songCount = this.props.initialSongList.length + this.props.heroSongs.length + 2;
    return (
      <div className="song-player-bank">
        {Array.apply(null, Array(songCount)).map((_, i) => (
            <div id={getParentPlayerId(i)}></div>
        ))}
      </div>
    )
  }
}

export default SongPlayerBank;
