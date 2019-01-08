import React from 'react';

const YT_SONG_LIST_PLAYER_CLASSNAME = i => `song-list-yt-player-${i}`;

const YT_MATCH_URL = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;

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
    new Promise(resolve => {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      window.onYouTubeIframeAPIReady = () => resolve(window.YT)
    })
    .then(YT => {
      const songListPlayers = this.props.initialSongList.reduce((currPlayers, song, i) => {
        if (!!song.soundcloud_track_id) return currPlayers
        else return {
          ...currPlayers,
          [song.id]: new YT.Player(YT_SONG_LIST_PLAYER_CLASSNAME(i), {
            videoId: song.youtube_link.match(YT_MATCH_URL)[1],
            events: { 'onReady': this.onPlayerReady }
          })
        }
      }, {});
      console.log("PLAYERS LOADED");
      console.log(this.props.initialSongList.map(s => s.id));
      console.log(songListPlayers);
      console.log(this.props.initialActiveSong);
      this.setState({
        songListPlayers: songListPlayers,
        activePlayer: songListPlayers[this.props.initialActiveSong.id]
      })
    })
  }

  onPlayerReady = ref => {
    console.log('Player Ready!');
    console.log(ref);
  }

  playSongListSong = songToPlay => {
    if (!!this.state.activePlayer) {
      this.state.activePlayer.pauseVideo();
      this.state.activePlayer.seekTo(0);
    }
    const songToPlayPlayerData = this.state.songListPlayers[songToPlay.id];
    if (!!songToPlayPlayerData) {
      console.log(songToPlayPlayerData);
      songToPlayPlayerData.playVideo();
      this.setState({ activePlayer: songToPlayPlayerData });
    }
    // TODO handle undefined player data
  }

  playActiveSong = () => {
    console.log(this.state);
    this.state.activePlayer.playVideo();
  }

  pauseActiveSong = () => this.state.activePlayer.pauseVideo();

  setSongList = newSongList => {
    // TODO
  }

  render = () => {
    return (
      <div className="song-player-bank">
        {this.props.initialSongList.map((_, i) => (
            <div className="song-player-song">
              <div id={`song-list-yt-player-${i}`}>
              </div>
            </div>
        ))}
      </div>
    )
  }
}

export default SongPlayerBank;
