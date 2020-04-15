import React from "react";
//import ReactDOM from "react-dom";
import "./Home.css";
import { Link } from "react-router-dom";

//  Eunhye:
//  TO DO: error handling when user input doesn't follow the correct format. <county>, <state> or the data is non-existent (Due 04/17)
//  TO DO: css and graphs on the bottom. compare to the national average. (Due 04/17)

//  Ash:
//  TO DO: avg us (Due 04/17)
//  TO DO: pop up error bug (Due 04/17)

//  Future:
//  historical data

const counties = ["Ingham, Michigan", "Boulder, Colorado"];

class State extends React.Component {
  constructor(props) {
    super(props);

    this.items = counties;

    let search = window.location.search;
    let param = search.toString().split("=")[1].replace(/%20/g, " ");

    this.state = {
      isLoading: true,
      usStatsLoading: true,
      location: "",
      state: param,
      stateStat: [],
      usStats: [],
      suggestions: [],
    };
  }

  async componentDidMount() {
    //console.log(this.state.state)
    try {
      await fetch(`/stateCovid?state=${this.state.state}`).then((response) =>
        response
          .json()
          .then((data) => ({
            data: data,
            status: response.status,
          }))
          .then((res) => {
            this.setState({ stateStat: res.data, isLoading: false });
            //console.log(this.state.stats);
          })
      );
    } catch (e) {
      alert(e);
    }

    /*try {
      await fetch(`/usCovid}`).then((response) =>
        response
          .json()
          .then((data) => ({
            data: data,
            status: response.status,
          }))
          .then((res) => {
            this.setState({ usStats: res.data, usStatsLoading: false });
            //console.log(this.state.stats);
          })
      );
    } catch (e) {
      alert(e);
    }*/
  }

  onTextChanged = (e) => {
    const value = e.target.value;
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      suggestions = this.items.sort().filter((v) => regex.test(v));
    }
    this.setState(() => ({ suggestions, location: value }));
  };

  suggestionSelected(value) {
    this.setState(() => ({
      location: value,
      suggestions: [],
    }));
  }

  renderSuggestions() {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <ul>
        {suggestions.map((item) => (
          <li onClick={() => this.suggestionSelected(item)}>{item}</li>
        ))}
      </ul>
    );
  }

  renderStateStats() {
    return (
      <div className="centerStats">
        <div className="stats">
          confirmed: {this.state.stateStat[0].confirmed}
        </div>
        <div className="stats">deaths: {this.state.stateStat[0].deaths}</div>
        <div className="stats">
          recovered: {this.state.stateStat[0].recovered}
        </div>
        <div className="stats">
          last updated: {this.state.stateStat[0].lastUpdate}
        </div>
      </div>
    );
  }

  render() {
    const { location } = this.state;
    return (
      <div>
        <div className="header">
          <div className="main">
            <Link to={`/`} className="to-main">
              To Main
            </Link>{" "}
          </div>
          <h1 className="title">
            {this.state.state.toUpperCase()} COVID19 Stats
          </h1>
          <div className="search-box">
            <form className="autocomplete">
              <input
                className="input-box"
                type="location"
                name="location"
                value={location}
                placeholder="County, State"
                onChange={this.onTextChanged}
                autoComplete="off"
              />
              {this.renderSuggestions()}
            </form>
            <Link
              to={`/county?id=${this.state.location}`}
              className="search-button"
            >
              Search
            </Link>
          </div>
        </div>
        <div className="centerStats">
          {this.state.isLoading === false ? this.renderStateStats() : ""}
        </div>
        <div className="link">
          <a href="https://www.cdc.gov/coronavirus/2019-ncov/cases-updates/cases-in-us.html">
            {" "}
            Link to CDC{" "}
          </a>
        </div>
      </div>
    );
  }
}

export default State;
