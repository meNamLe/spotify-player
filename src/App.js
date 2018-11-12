import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import Spotify from 'spotify-web-api-js';
import Search from './components/search/search';
import SongItem from './components/song-item/song-item';
import SongCard from './components/song-card/song-card';

const spotifyWebApi = new Spotify();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      deviceId: "",
      loggedIn: false,
      playing: false,
      error: "",

      current: {
        trackName: "Track Name",
        artistName: "Artist Name",
        albumName: "Album Name",
        duration: 0,
        uri: '',
        cover:  ''
      },
      trackLoaded: false,

      searchList: Array(6).fill({}), 
      didSearch: false,

    };

    this.playerCheckInterval = null;

  }

  handleLogin() {
    if (this.state.token !== "") {
      this.setState({ loggedIn: true });
      spotifyWebApi.setAccessToken(this.state.token)
      // check every second for the player.
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
  }

  createEventHandlers() {
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });
  
    // Playback status updates
    this.player.on('player_state_changed', state => {
      console.log(state.track_window.current_track);
      this.onStateChanged(state)
    });
  
    // Ready
    this.player.on('ready', async data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      await this.setState({ deviceId: device_id });
      this.transferPlaybackHere();
    });
  }

  onStateChanged(state) {
    // if we're no longer listening to music, we'll get a null state.
    if (state !== null) {
      const {
        current_track: currentTrack,
        duration,
      } = state.track_window;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const uri = currentTrack.uri;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(", ");
      const cover = currentTrack.album.images[0].url;
      
      const playing = !state.paused;
      this.setState({
        current: {
          trackName,
          albumName,
          artistName,
          uri,
          cover,
          duration,
        },
        trackLoaded: true,
        playing,
      });
    }
  }

  checkForPlayer() {
    const { token } = this.state;
  
    if (window.Spotify !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "Matt's Spotify Player",
        getOAuthToken: cb => { cb(token); },
      });
      this.createEventHandlers();
  
      // finally, connect!
      this.player.connect();
    }
  }

  transferPlaybackHere() {
    this.handlerSearch('head in the clouds');
    const { deviceId, token } = this.state;
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "device_ids": [ deviceId ],
        "play": true,
      }),
    });
  }

  searchHelper(val,idx) {
    const artistName = val.artists
      .map(artist => artist.name)
      .join(", ");    
    const uri = val.uri,
          trackName = val.name,
          duration = val.duration_ms,
          albumName = val.album.name,
          cover = val.album.images[0].url;


    return {
      artistName,
      albumName,
      trackName,
      uri,
      duration,
      cover,
    }

  }

  async handlerSearch(term) {
    await spotifyWebApi.searchTracks(term, {limit: 6}).then(data => {
      // ...render list of search results...
      console.log(data);
      const searchList = data.tracks.items.map((val,idx) => this.searchHelper(val,idx))
      this.setState({ searchList , didSearch: true})
      console.log(this.state.searchList);
      console.log(this.state.current);

    }, function(err) {
      console.error(err);
    })
  }

  handlerPlayPause() {
    this.player.togglePlay(); 
  }

  handlerStartSong(uri) {
    spotifyWebApi.play({"uris": [`${uri}`]});
  }

  renderSongSearches() {
    return this.state.searchList.map(trackObj => {
        return (
          <div key={trackObj.uri}>
            <SongItem 
              trackObj={trackObj}
              handlerPlayPause={(uri) => this.handlerPlayPause()}
              handlerStartSong={(uri) => this.handlerStartSong(uri)} 
            />
          </div>
        )
      })
  }


  render() {
    const {
      token,
      loggedIn,
      error,
      playing,
      didSearch,
      trackLoaded,
    } = this.state;
    const {
      artistName,
      albumName,
      trackName,
      duration,
     } = this.state.current;


    return (
      <div className="App">
        <div className="App-header">
          <h2>Now Playing: Vibes</h2>
        </div>
  
        {error && <p>Error: {error}</p>}
  
        {loggedIn ?
        (

          <div className="App-Login-Component">
            <Search searchTerm="Head In The Clouds" handlerSearch={(term) => this.handlerSearch(term)}/>
            {didSearch ? this.renderSongSearches() : ''}
            {trackLoaded ? <SongCard current={this.state.current}/> : ''}
          </div>

        ) : (

          <div>
            <p className="App-intro">
              Enter your Spotify access token. Get it from{" "}
              <a href="https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/#authenticating-with-spotify">
                here
              </a>.
            </p>
            <p>
              <input type="text" value={token} onChange={e => this.setState({ token: e.target.value })} />
            </p>
            <p>
              <button onClick={() => this.handleLogin()}>Go</button>
            </p>
          </div>

        )
        }
      </div>
    );
  }
}

export default App;
