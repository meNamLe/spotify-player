import React, { Component } from 'react';
import './song-card.scss';

class SongCard extends Component {
    constructor(props) {
        super(props);
    }

    handleClick() {
        
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
                <img src={cover} />
                <h2>{trackName}</h2>
                <h3>{artistName}</h3>
                <i onClick={() => this.handleClick()} className="mdi mdi-pause" />
            </div>
        )
    }
}

export default SongCard;
