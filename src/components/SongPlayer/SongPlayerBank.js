import React from 'react';
import SoundCloudWidget from 'soundcloud-widget';

import './SongPlayerBank.scss';

const getYoutubeSongListPlayerId = i => `song-list-yt-player-${i}`;
const getSoundcloudSongListPlayerId = i => `song-list-sc-player-${i}`;

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
      this.activePlayer = this.songListPlayers[this.props.initialActiveSong.id]
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

  setSongListPlayers = songList => {
    const activeIndex = !!this.activePlayer ? this.activePlayer.index : null;
    var indexOffset = this.props.heroSongs.length;

    this.songListPlayers = songList.reduce((currPlayers, song, i) => {
      const listIndex = i + indexOffset;

      if (!!this.heroPlayers[song.id]) {
        return currPlayers

      } else if (i + indexOffset === activeIndex) {
        indexOffset += 1;
        return {
          ...currPlayers,
          [this.activePlayer.songId]: this.activePlayer,
          [song.id]: this.createPlayer(i + indexOffset)
        }

      } else {
        return {
          ...currPlayers,
          [song.id]: this.createPlayer(song, listIndex)
        }
      }
    }, {});
    this.allPlayers = { ...this.heroPlayers, ...this.songListPlayers }
  }

  createPlayer = (song, index) => (
      !!song.soundcloud_track_id ?
        this.createSoundCloudPlayer(song, index) :
        this.createYoutubePlayer(song, index)
  )


  createYoutubePlayer = (song, index) => {
    const player = new this.YT.Player(getYoutubeSongListPlayerId(index), {
      videoId: song.youtube_link.match(youtubeUrlPattern)[1],
      events: { 'onReady': this.onPlayerReady(song.id) }
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

  createSoundCloudPlayer = (song, index) => {
    const playerId = getSoundcloudSongListPlayerId(index);
    document.getElementById(playerId)
      .setAttribute("src", getSoundCloudUrl(song.soundcloud_track_id));

    const player = new SoundCloudWidget(playerId);
    player.bind(SoundCloudWidget.events.READY, this.onPlayerReady(song.id));
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
    console.log('Player Ready!', songId, this.allPlayers);

    this.allPlayers[songId].getDuration()
    .then(seconds => this.props.setSongDuration(songId, seconds))
  }

  updateSongProgress = progressRatio => this.activePlayer.seekTo(progressRatio);

  playSongListSong = songToPlay => {
    // TODO get from `allPlayers`
    const newActivePlayer = this.allPlayers[songToPlay.id]
    if (!!newActivePlayer) {
      console.log("PLAYING NEW SONG");
      newActivePlayer.play();

      if (!!this.activePlayer) {
        clearInterval(this.durationInterval);
        this.activePlayer.pause();
        this.activePlayer.seekTo(0);
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
    console.log(this.sprops);
    const songCount = this.props.initialSongList.length + this.props.heroSongs.length + 1
    return (
      <div className="song-player-bank">
        {Array.apply(null, Array(songCount)).map((_, i) => (
            <div className="song-player-song">
              <div id={`song-list-yt-player-${i}`}></div>
              <iframe id={`song-list-sc-player-${i}`}></iframe>
            </div>
        ))}
      </div>
    )
  }
}

export default SongPlayerBank;
