import React from 'react';
import SoundCloudWidget from 'soundcloud-widget';

const getYoutubeSongListPlayerId = i => `song-list-yt-player-${i}`;
const getSoundcloudSongListPlayerId = i => `song-list-sc-player-${i}`;

const youtubeUrlPattern = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;
const getSoundCloudUrl = scid => {
  const url = encodeURIComponent(`https://api.soundcloud.com/tracks/${scid}`)
  return `https://w.soundcloud.com/player/?url=${url}`;
}

class SongPlayerBank extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //heroSongs: props.heroSongs,
      songListPlayers: undefined,
      activePlayer: undefined,
      //ytPlayerCreator: undefined
    };
  }

  shouldComponentUpdate = () => false;

  componentDidMount = () => {
    this.loadYoutubeIframeApi()
    .then(YT => {
      const songListPlayers = this.props.initialSongList.reduce((currPlayers, song, i) => ({
        ...currPlayers,
        [song.id]: !!song.soundcloud_track_id ?
          this.createSoundCloudPlayer(song, i) :
          this.createYoutubePlayer(YT, song, i)
      }), {});

      this.setState({
        songListPlayers: songListPlayers,
        activePlayer: songListPlayers[this.props.initialActiveSong.id]
      })
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
      events: { 'onReady': this.onPlayerReady }
    });
    return {
      play: () => player.playVideo(),
      pause: () => player.pauseVideo()
    };
  }

  createSoundCloudPlayer = (song, index) => {
    const playerId = getSoundcloudSongListPlayerId(index);
    document.getElementById(playerId)
      .setAttribute("src", getSoundCloudUrl(song.soundcloud_track_id));

    const player = new SoundCloudWidget(playerId);
    return {
      play: () => player.play(),
      pause: () => player.pause()
    };
  }

  onPlayerReady = ref => {
    console.log('Player Ready!');
    console.log(ref);
  }

  playSongListSong = songToPlay => {
    if (!!this.state.activePlayer) {
      this.state.activePlayer.pause();
      this.state.activePlayer.seekTo(0);
    }
    const newActivePlayer = this.state.songListPlayers[songToPlay.id];
    if (!!newActivePlayer) {
      newActivePlayer.play();
      this.setState({ activePlayer: newActivePlayer });
    }
    // TODO handle undefined player data
  }

  playActiveSong = () => this.state.activePlayer.play();

  pauseActiveSong = () => this.state.activePlayer.pause();

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
