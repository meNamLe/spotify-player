import React, { Component } from 'react';
import './search.scss';

export default class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {
            term: props.searchTerm
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.handlerSearch(this.state.term);
    }

    handleChange = (event) => {
        this.setState({ term: event.target.value });
    }

    render() {
        return (
            <div className="search-component">
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.term} onChange={this.handleChange} />
                </form>
            </div>
        )
    }
}