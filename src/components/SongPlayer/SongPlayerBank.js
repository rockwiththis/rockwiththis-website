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
    this.songListPlayers = undefined;
    this.activePlayer = undefined;
    this.durationInterval = undefined;
  }

  shouldComponentUpdate = () => false;

  componentDidMount = () => {
    this.loadYoutubeIframeApi()
    .then(YT => {
      this.songListPlayers = this.props.initialSongList.reduce((currPlayers, song, i) => ({
        ...currPlayers,
        [song.id]: !!song.soundcloud_track_id ?
          this.createSoundCloudPlayer(song, i) :
          this.createYoutubePlayer(YT, song, i)
      }), {});
      this.activePlayer = this.songListPlayers[this.props.initialActiveSong.id];
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
  );

  createYoutubePlayer = (YT, song, index) => {
    const player = new YT.Player(getYoutubeSongListPlayerId(index), {
      videoId: song.youtube_link.match(youtubeUrlPattern)[1],
      events: { 'onReady': this.onPlayerReady(song.id) }
    });
    return {
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
    console.log('Player Ready!');
    console.log(songId);

    this.songListPlayers[songId].getDuration()
    .then(seconds => this.props.setSongDuration(songId, seconds))
  }

  updateSongProgress = progressRatio => this.activePlayer.seekTo(progressRatio);

  playSongListSong = songToPlay => {
    const newActivePlayer = this.songListPlayers[songToPlay.id];
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
    console.log("PLAYING CURRENT SONG");
    this.activePlayer.play();
    this.durationInterval = setInterval(this.activePlayer.reportProgress, REPORT_DURATION_INTERVAL);
  }

  pauseActiveSong = () => {
    console.log("PAUSING ACTIVE SONG");
    this.activePlayer.pause();
    clearInterval(this.durationInterval);
  }

  setSongList = newSongList => {
    // TODO
  }

  render = () => {
    return (
      <div className="song-player-bank">
        {this.props.initialSongList.map((_, i) => (
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
