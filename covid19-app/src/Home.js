import React from "react";
//import {ReactDOM} from "react-dom";
import "./Home.css";
import { ReactComponent as ReactMap } from "./Blank_US_Map.svg";
import $ from "jquery";
import { Link, Route } from "react-router-dom"; 
//import { Button } from 'react-bootstrap';

//  TO DO: link map to state page (with param state as id)
//  TO DO: maybe a better css? 

const state_caps = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Deleware",
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
            this.setState({ usStats: res.data, usStatsLoading: false});
            //console.log("US: ", this.state.usStats[0]);
          })
      );
    } catch (e) {
      alert(e);
    }
  }

  async componentDidMount() {
    $(".map-img #MI").css("fill", "red");
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
    for (let i = 0; i < this.state.stats.length; i++) {
      //console.log(this.state.stats[i]._id);
      let key = Object.keys(state_caps).find(
        (key) => state_caps[key] === this.state.stats[i]._id
      );
      if (key) {
        this.state.stats[i]._id = key;
        //console.log(this.state.stats[i]._id);
      }
      if (this.state.stats[i].confirmed > 10000) {
        $(".map-img #" + key).css("fill", "red");
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

  updateState(value){
    this.setState({
      state: value,
    })
  }

  renderUsStats(){
    return (
      <div className="centerStats">
        <div className="stats">confirmed:  {this.state.usStats[0].confirmed}</div>
        <div className="stats">deaths:  {this.state.usStats[0].deaths}</div>
        <div className="stats">recovered:  {this.state.usStats[0].recovered}</div>
        <div className="stats">last updated:  {this.state.usStats[0].lastUpdate}</div>
      </div>
      )
  }

  render() {
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
                placeholder="city, state"
                onChange={this.handleChange}
              />
            </form>
            <Link to={`/county?id=${this.state.location}`}>Enter</Link> 
          </div>
        </div>
        <div className="centerStats">{this.state.usStatsLoading === false ? this.renderUsStats(): "Loading..."}</div>
        <div className="map">
          {this.props.isLoading === true ? (
            "error"
          ) : (
            <ReactMap className="map-img" alt="map" />
          )}
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
