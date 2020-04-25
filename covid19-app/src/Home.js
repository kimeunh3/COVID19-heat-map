import React from "react";
//import {ReactDOM} from "react-dom";
import "./Home.css";
import { ReactComponent as ReactMap } from "./imgs/Blank_US_Map.svg";
import $ from "jquery";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

//  Ash:
//  ?: Kafka deployment -do we want this?
//  BUG: Backend sometimes return data grouped by most recent. Sometimes not.
//  BUG: regex for boulder, ingham /bou/i stopped working


const state_caps = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DC2: "District of Columbia",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};
//const counties = ["Ingham, Michigan", "Boulder, Colorado"];

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      usStatsLoading: true,
      stats: [],
      usStats: [],
      location: "",
      prevLocation: "",
      state: "",
      suggestions: [],
      counties: [],
      confirmed: true,
    };

    try {
      fetch("/usCovid").then((response) =>
        response
          .json()
          .then((data) => ({
            data: data,
            status: response.status,
          }))
          .then((res) => {
            this.setState({ usStats: res.data, usStatsLoading: false });
            //console.log("US: ", this.state.usStats[0]);
          })
      );
    } catch (e) {
      alert(e);
    }
  }

  async componentDidMount() {
    try {
      await fetch("/allStateCovid").then((response) =>
        response
          .json()
          .then((data) => ({
            data: data,
            status: response.status,
          }))
          .then((res) => {
            this.setState({ stats: res.data, isLoading: false });
            //console.log("lastUpdate", this.state.stats.lastUpdate);
          })
      );
    } catch (e) {
      alert(e);
    }
  }

  changeStats() {
    this.setState({ confirmed: !this.state.confirmed });
    console.log("yay");
  }

  renderUsMap() {
    let total =
      this.state.confirmed === true
        ? this.state.usStats[0].confirmed
        : this.state.usStats[0].deaths;
    //let total_death = this.state.usStats[0].deaths;
    //let total_recovered = this.state.usStats[0].recovered;
    for (let i = 0; i < this.state.stats.length; i++) {
      let key = Object.keys(state_caps).find(
        (key) => state_caps[key] === this.state.stats[i]._id
      );
      let curr =
        this.state.confirmed === true
          ? this.state.stats[i].confirmed
          : this.state.stats[i].deaths;
      let rgba =
        this.state.confirmed === true ? "rgba(255,0,0," : "rgba(0,0,255,";
      if (curr / total < 0.0025) {
        $(".map-img #" + key).css("fill", rgba + "0.15)");
        $("#0_0025").css("background-color", rgba + "0.15)");
      } else if (curr / total < 0.00625) {
        $(".map-img #" + key).css("fill", rgba + "0.4)");
        $("#0_00625").css("background-color", rgba + "0.4)");
      } else if (curr / total < 0.025) {
        $(".map-img #" + key).css("fill", rgba + "0.65)");
        $("#0_025").css("background-color", rgba + "0.65)");
      } else if (curr / total < 0.3) {
        var color =
          this.state.confirmed === true ? "rgba(230,0,0)" : "rgba(0,0,230)";
        $(".map-img #" + key).css("fill", color);
        $("#0_3").css("background-color", color);
      } else {
        var color =
          this.state.confirmed === true ? "rgba(139,0,0)" : "rgba(0,0,139)";
        $(".map-img #" + key).css("fill", color);
        $("#last").css("background-color", color);
      }
      $(".map-img #" + key).on("click", function () {
        window.location.href = "/state?id=" + state_caps[key];
      });
    }
  }

  onTextChanged = (e) => {
    let countiesList = [];
    this.state.counties.forEach((element) =>
      countiesList.push(element.city + ", " + element.province)
    );

    //console.log(countiesList)
    const value = e.target.value;
    let suggestions = [];
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      suggestions = countiesList.sort().filter((v) => regex.test(v));
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

  updateSuggestion() {
    if (this.state.prevLocation !== this.state.location) {
      let c = this.state.location.split(", ")[0];
      let s = this.state.location.split(", ")[1];

      try {
        fetch(`/suggestions?county=${c}&state=${s}`).then((response) =>
          response
            .json()
            .then((data) => ({
              data: data,
              status: response.status,
            }))
            .then((res) => {
              if (res.data.length > 0) {
                this.setState(() => ({ counties: res.data }));
              }
            })
        );
      } catch (e) {
        alert(e);
      }
    }
  }

  updateState(value) {
    this.setState({
      state: value,
    });
  }

  renderUsStats() {
    return (
      <div className="centerStats">
        <div className="stats">
          confirmed: {this.state.usStats[0].confirmed}
        </div>
        <div className="stats">deaths: {this.state.usStats[0].deaths}</div>
        <div className="stats">
          recovered: {this.state.usStats[0].recovered}
        </div>
        <div className="stats">
          last updated: {this.state.usStats[0].lastUpdate}
        </div>
      </div>
    );
  }

  render() {
    var confirmed_cases =
      this.state.usStatsLoading === false
        ? this.state.confirmed === true
          ? this.state.usStats[0].confirmed
          : this.state.usStats[0].deaths
        : 0;
    const { location } = this.state;
    return (
      <div>
        <div className="header">
          <h1 className="title">US COVID19 Stats</h1>
          <div className="search-box">
            <form
              className="autocomplete"
              method="post"
              action={`/county?id=${this.state.location}`}
            >
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
            {this.updateSuggestion()}
          </div>
        </div>
        <div className="centerStats">
          {this.state.usStatsLoading === false
            ? this.renderUsStats()
            : "Loading..."}
        </div>
        <div className="button">
          <Button
            className="btn-map"
            variant="primary"
            onClick={() => this.setState({ confirmed: !this.state.confirmed })}
          >
            {this.state.confirmed === true
              ? "View Death Statistics"
              : "View Confirmed Cases"}
          </Button>
        </div>
        <div className="map">
          {this.props.isLoading === true ? (
            "error"
          ) : (
            <ReactMap className="map-img" alt="map" />
          )}
          <div className="legend">
            <p>
              {this.state.confirmed === true ? "confirmed cases" : "deaths"}
            </p>
            <p>
              <span className="dot" id="0_0025"></span>
              <span className="range">
                -{Math.floor(confirmed_cases * 0.0025)}
              </span>
            </p>
            <p>
              <span className="dot" id="0_00625"></span>
              <span className="range">
                {Math.floor(confirmed_cases * 0.0025) + 1}-
                {Math.floor(confirmed_cases * 0.00625)}{" "}
              </span>
            </p>
            <p>
              <span className="dot" id="0_025"></span>
              <span className="range">
                {Math.floor(confirmed_cases * 0.00625) + 1}-
                {Math.floor(confirmed_cases * 0.025)}{" "}
              </span>
            </p>
            <p>
              <span className="dot" id="0_3"></span>
              <span className="range">
                {Math.floor(confirmed_cases * 0.025) + 1}-
                {Math.floor(confirmed_cases * 0.3)}
              </span>
            </p>
            <p>
              <span className="dot" id="last"></span>
              <span className="range">
                {Math.floor(confirmed_cases * 0.3) + 1}-
              </span>
            </p>
          </div>
        </div>
        <div>
          {this.state.usStatsLoading === false
            ? this.renderUsMap()
            : console.log("Map is Loading")}
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

export default Home;
