import React from 'react'
import YouTube from 'react-youtube'
import ReactPlayer from 'react-player'

class OffScreen extends React.Component {

    setSongDuration = ref => {
      this.props.actions.setSongDuration(ref.getDuration());
    }

    render() {
        const activeSong = this.props.activeSong
        const url = activeSong.soundcloud_track_id ? `https%3A//api.soundcloud.com/tracks/${activeSong.soundcloud_track_id}` : activeSong.youtube_link
        return (
            <div className='iframe-and-youtube-wrapper'>
                <ReactPlayer
                    playing={this.props.isPlaying}
                    onReady={this.setSongDuration}
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
