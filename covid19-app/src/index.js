import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { ReactComponent as ReactMap } from "./Blank_US_Map.svg";
import $ from "jquery";

const state_caps = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
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

class Test extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
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
            this.setState({ usStats: res.data });
            console.log("US: ", this.state.usStats);
          })
      );
    } catch (e) {
      alert(e);
    }
  }

  async componentDidMount() {
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
      } else if (curr / total_confirmed < 0.00625) {
        $(".map-img #" + key).css("fill", "rgba(255,0,0,0.3)");
      } else if (curr / total_confirmed < 0.01875) {
        $(".map-img #" + key).css("fill", "rgba(255,0,0,0.45)");
      } else if (curr / total_confirmed < 0.025) {
        $(".map-img #" + key).css("fill", "rgba(255,0,0,0.6)");
      } else if (curr / total_confirmed < 0.0375) {
        $(".map-img #" + key).css("fill", "rgba(255,0,0,0.75)");
      } else if (curr / total_confirmed < 0.05) {
        $(".map-img #" + key).css("fill", "rgba(230,0,0)");
      } else if (curr / total_confirmed < 0.3) {
        $(".map-img #" + key).css("fill", "rgba(180,0,0)");
      } else {
        $(".map-img #" + key).css("fill", "rgba(139,0,0)");
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
                placeholder="place"
                onChange={this.handleChange}
              />
            </form>
            <button
              onClick={() => {
                this.handleClick();
              }}
            >
              Enter
            </button>
          </div>
        </div>
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

ReactDOM.render(<Test />, document.getElementById("root"));
