import React, { Component } from 'react';
import './song-item.scss';

class SongItem extends Component {
    isPaused;

    onStartSong() {
        this.props.handlerStartSong(this.props.trackObj.uri);
    }

    onPlayPause() {
        this.props.handlerPlayPause(this.props.trackObj.uri);
    }

    render() {
        const {
            trackName,
            artistName,
            uri,
            cover,
            duration,
            handlerStartSong,
        } = this.props.trackObj;
        const { playing, playingUri } = this.props.current.isPlaying;


        if(playing === true && playingUri === uri ) {
            this.isPaused = true;
        } else {
            this.isPaused = false;
        }
        if(uri === "spotify:track:6TodWdTSDfzwgYynTZSvJn") {
            console.log(playing)
        }


        const conversion = Math.floor(duration / 1000);
        const min = Math.floor(conversion / 60);
        let seconds = conversion % 60;

        if(seconds < 10) {
            seconds = '0' + seconds; 
        }

        return (
            <div className="song-item-component">
                        
                {
                    this.isPaused ? (
                        <button onClick={() => this.onPlayPause()}><i className="mdi mdi-pause" /></button> 
                            ) : (
                        <button onClick={() => this.onStartSong()}><i className="mdi mdi-play" /></button>
                        )
                }                
                <div className="track-artist">
                    <h4>{trackName}</h4>
                    <h5>{artistName}</h5>
                </div>
                <h3 className="duration">{min}:{seconds}</h3>
            </div>
        )
    }
}

export default SongItem;
