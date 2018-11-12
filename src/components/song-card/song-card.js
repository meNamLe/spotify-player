import React, { Component } from 'react';
import './song-card.scss';

class SongCard extends Component {
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
    
        return (
            <div className="song-card-component">
                <div className="container">
                    <img src={cover} />
                    <i onClick={() => this.handleClick()} className="mdi mdi-pause" />
                </div>
                <h2>{trackName}</h2>
                <h3>{artistName}</h3>
            </div>
        )
    }
}

export default SongCard;
