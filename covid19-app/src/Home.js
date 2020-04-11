import React from "react";
//import {ReactDOM} from "react-dom";
import "./Home.css";
import { ReactComponent as ReactMap } from "./Blank_US_Map.svg";
import $ from "jquery";
import { Link, Route } from "react-router-dom";
//import { Button } from 'react-bootstrap';

//  TO DO: link map to state page (with param state as id) -Eunhye (Due 04/14)c<Link to={`/state?id=${스테이트 이름}`}></Link>
//  TO DO: drop down menu ish for search bar -Eunhye (Due 04/14)
//  TO DO: maybe a better css? -Eunhye (Due 04/14)
//  TO DO: legend for colors

//  TO DO: pass objects to State.js and County.js -Ashley (Due 04/14)

//  TO DO: have to click enter -Eunhye
//  TO DO: reload bug

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

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      usStatsLoading: true,
      stats: [],
      usStats: [],
      location: "",
      state: "",
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
            //console.log(this.state.stats);
          })
      );
    } catch (e) {
      alert(e);
    }

    let total_confirmed = this.state.usStats[0].confirmed;
    let total_death = this.state.usStats[0].deaths;
    let total_recovered = this.state.usStats[0].recovered;
    for (let i = 0; i < this.state.stats.length; i++) {
      //console.log(this.state.stats[i]._id);
      let key = Object.keys(state_caps).find(
        (key) => state_caps[key] === this.state.stats[i]._id
      );
      if (key) {
        this.state.stats[i]._id = key;
        //console.log(this.state.stats[i]._id);
      }
      let curr = this.state.stats[i].confirmed;
      if (curr / total_confirmed < 0.0025) {
        $(".map-img #" + key).css("fill", "rgba(255,0,0,0.15)");
        $("#0_0025").css("background-color", "rgba(255,0,0,0.15)");
      } else if (curr / total_confirmed < 0.00625) {
        $(".map-img #" + key).css("fill", "rgba(255,0,0,0.3)");
        $("#0_00625").css("background-color", "rgba(255,0,0,0.3)");
      } else if (curr / total_confirmed < 0.01875) {
        $(".map-img #" + key).css("fill", "rgba(255,0,0,0.45)");
        $("#0_01875").css("background-color", "rgba(255,0,0,0.45)");
      } else if (curr / total_confirmed < 0.025) {
        $(".map-img #" + key).css("fill", "rgba(255,0,0,0.6)");
        $("#0_025").css("background-color", "rgba(255,0,0,0.6)");
      } else if (curr / total_confirmed < 0.0375) {
        $(".map-img #" + key).css("fill", "rgba(255,0,0,0.75)");
        $("#0_0375").css("background-color", "rgba(255,0,0,0.75)");
      } else if (curr / total_confirmed < 0.05) {
        $(".map-img #" + key).css("fill", "rgba(230,0,0)");
        $("#0_05").css("background-color", "rgba(230,0,0)");
      } else if (curr / total_confirmed < 0.3) {
        $(".map-img #" + key).css("fill", "rgba(180,0,0)");
        $("#0_3").css("background-color", "rgba(180,0,0)");
      } else {
        $(".map-img #" + key).css("fill", "rgba(139,0,0)");
        $("#last").css("background-color", "rgba(139,0,0)");
      }
      //this.state.stats[i]._id =
    }
  }

  handleChange = (event) => {
    //console.log("location: ", this.state.location);
    this.setState({
      location: event.target.value,
    });
  };

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
      this.state.isLoading === false ? this.state.usStats[0].confirmed : 0;
    return (
      <div>
        <div className="header">
          <h1 className="title">US COVID19 Stats</h1>
          <div className="search-box">
            <form>
              <input
                type="location"
                name="location"
                value={this.state.location}
                placeholder="county, state"
                onChange={this.handleChange}
              />
            </form>
            <Link to={`/county?id=${this.state.location}`}>Enter</Link>
          </div>
        </div>
        <div className="centerStats">
          {this.state.usStatsLoading === false
            ? this.renderUsStats()
            : "Loading..."}
        </div>
        <div className="map">
          {this.props.isLoading === true ? (
            "error"
          ) : (
            <ReactMap className="map-img" alt="map" />
          )}
          <div className="legend">
            <p>
              <span class="dot" id="0_0025"></span>
              <span class="range">
                1-
                {Math.floor(confirmed_cases * 0.0025)}
              </span>
            </p>
            <p>
              <span class="dot" id="0_00625"></span>
              <span class="range">
                {Math.floor(confirmed_cases * 0.0025) + 1}-
                {Math.floor(confirmed_cases * 0.00625)}{" "}
              </span>
            </p>
            <p>
              <span class="dot" id="0_01875"></span>
              <span class="range">
                {Math.floor(confirmed_cases * 0.00625) + 1}-
                {Math.floor(confirmed_cases * 0.01875)}{" "}
              </span>
            </p>
            <p>
              <span class="dot" id="0_025"></span>
              <span class="range">
                {Math.floor(confirmed_cases * 0.01875) + 1}-
                {Math.floor(confirmed_cases * 0.025)}{" "}
              </span>
            </p>
            <p>
              <span class="dot" id="0_0375"></span>
              <span class="range">
                {Math.floor(confirmed_cases * 0.0025) + 1}-
                {Math.floor(confirmed_cases * 0.0375)}
              </span>
            </p>
            <p>
              <span class="dot" id="0_05"></span>
              <span class="range">
                {Math.floor(confirmed_cases * 0.0375) + 1}-
                {Math.floor(confirmed_cases * 0.05)}
              </span>
            </p>
            <p>
              <span class="dot" id="0_3"></span>
              <span class="range">
                {Math.floor(confirmed_cases * 0.05) + 1}-
                {Math.floor(confirmed_cases * 0.3)}
              </span>
            </p>
            <p>
              <span class="dot" id="last"></span>
              <span class="range">
                {Math.floor(confirmed_cases * 0.3) + 1}-
              </span>
            </p>
          </div>
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
