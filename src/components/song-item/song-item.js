import React, { Component } from 'react';
import './song-item.scss';

class SongItem extends Component {
    isPaused = true;

    onStartSong() {
        this.props.handlerStartSong(this.props.trackObj.uri);
        this.isPaused = !this.isPaused;
        console.log('here');
    }

    onPlayPause() {
        this.props.handlerPlayPause(this.props.trackObj.uri);
        this.isPaused = !this.isPaused;
    }

    render() {
        const {
            trackName,
            artistName,
            uri,
            cover,
            duration,
            handlerStartSong,
            playing
        } = this.props.trackObj;

        const conversion = Math.floor(duration / 1000);
        const min = Math.floor(conversion / 60);
        const seconds = conversion % 60;

        return (
            <div className="song-item-component">
                
                {
                this.isPaused ? (
                    <button onClick={() => this.onStartSong()}><i className="mdi mdi-pause"/></button> 
                        ) : (
                    <button onClick={() => this.onPlayPause()}><i className="mdi mdi-play" /></button>
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