import React from "react";
import ReactDOM from "react-dom";
import "./Home.css";
import { ReactComponent as ReactMap } from "./Blank_US_Map.svg";
import $ from "jquery";
import { Link } from "react-router-dom"; 

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
      countyStats: null,
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
            console.log("US: ", this.state.usStats[0]);
          })
      );
    } catch (e) {
      alert(e);
    }
  }

  async componentDidMount() {
    $(".map-img #MI").css("fill", "red");
    try {
      await fetch("/stateCovid").then((response) =>
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

  async handleClick() {
    let city = this.state.location.split(" ")[0];
    let state = this.state.location.split(" ")[1];

    try {
      await fetch(`/cityCovid?city=${city}&state=${state}`).then((response) =>
        response
          .json()
          .then((data) => ({
            data: data,
            status: response.status,
          }))
          .then((res) => {
            this.setState({ countyStats: res.data });
            //console.log(this.state.countyStats)
          })
      );
    } catch (e) {
      alert(e);
    }
  }

  renderUsStats(){
    return (
      <div className="centerStats">
        <div className="stats">confirmed:  {this.state.usStats[0].confirmed}</div>
        <div className="stats">deaths:  {this.state.usStats[0].deaths}</div>
        <div className="stats">recovered:  {this.state.usStats[0].recovered}</div>
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
            <Link to="/county">
            <button
              onClick={() => {
                this.handleClick();
              }}
            >
              Enter
            </button>
            </Link>
          </div>
        </div>
        <div>{this.state.usStatsLoading === false ? this.renderUsStats(): "helloWorld"}</div>
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
