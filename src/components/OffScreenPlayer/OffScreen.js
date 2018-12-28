import React from 'react'
import YouTube from 'react-youtube'
import ReactPlayer from 'react-player'

class OffScreen extends React.Component {

    setSongDuration = ref => {
      this.props.actions.setSongDuration(ref.getDuration());
    }

    songLoaded = ref => {
      // There may be a day in the future where we want to load a song and not play it
      // ... but that day is not today
      console.log("song loaded");
      this.setSongDuration(ref);
      this.props.actions.togglePlayPause(true);
    }

    render() {
        const activeSong = this.props.activeSong
        const url = activeSong.soundcloud_track_id ? `https%3A//api.soundcloud.com/tracks/${activeSong.soundcloud_track_id}` : activeSong.youtube_link
        return (
            <div className='iframe-and-youtube-wrapper'>
                <ReactPlayer
                    playing={this.props.isPlaying}
                    onReady={this.songLoaded}
                    onProgress={this.props.actions.setSongProgress}
                    onEnded={this.props.changeSongOnEnd}
                    url={url}
                    ref={(e) => {
                      this.player = e;
                    }}
                />
            </div>
        )
    }
}

export default OffScreen
