import React, { Component } from 'react';
import './song-card.scss';

class SongCard extends Component {
    isPaused = false;
    constructor(props) {
        super(props);
    }

    handleClick() {
        this.props.handlerPlayPause();
    }

    render() {
        const {
            cover,
            trackName,
            artistName,
            albumName,
            uri,
            duration,
        } = this.props.current;

        const { playing } = this.props.current.isPlaying;

        this.isPaused = playing;
    
        return (
            <div className="song-card-component">
                <div className="container">
                    <img src={cover} />

                    {this.isPaused ? (
                        <i onClick={() => this.handleClick()} className="mdi mdi-pause" />
                    ) : (
                        <i onClick={() => this.handleClick()} className="mdi mdi-play" />
                    )}
                </div>
                <h2>{trackName}</h2>
                <h3>{artistName}</h3>
            </div>
        )
    }
}

export default SongCard;
