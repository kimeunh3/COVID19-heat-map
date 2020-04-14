import React from "react";
//import ReactDOM from "react-dom";
import "./Home.css";
import { Link } from "react-router-dom";

//  Eunhye:
//  DONE: might be nice to have a logo or something that redirects to the main page //Eunhye (Due 04/14)

//  TO DO: css and graphs on the bottom. compare to the national average. //Backend-Ash (Due 04/14)

//  Future:
//  TO DO: might be nice to have a logo or something that redirects to the main page -Eunhye
//  css and graphs on the bottom. compare to the national average. Frontend(display) Eunhye

const counties = ["Ingham, Michigan", "Boulder, Colorado"];

class State extends React.Component {
  constructor(props) {
    super(props);

    this.items = counties;

    let search = window.location.search;
    let param = search.toString().split("=")[1].replace(/%20/g, " ");

    this.state = {
      isLoading: true,
      location: "",
      state: param,
      stateStat: [],
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
          {this.state.isLoading === false ? this.renderStateStats() : "Loading"}
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
