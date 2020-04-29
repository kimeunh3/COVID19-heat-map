import React from "react";
//import ReactDOM from "react-dom";
import "./Home.css";
import { Link } from "react-router-dom";
import BarChart from "react-bar-chart";
import { Button } from "react-bootstrap";

//  Eunhye:
//  TODO: change colors for the graph
//  TODO: state county map
//  1. svg 따로 만드는거 -css 건들일 필요 X, 제일 깔끔 / svg 파일이 많다, 불러와여할게 많음
//  2. 그냥 원래 있던 svg 쓰돼 그 주만 하이라이트 -제일 간단함 / 공간 낭비 제일 안 이쁨 
//  3. 2 에서 하이라이트 대신 포커스로 -svg 건들일 필요 x / focus 위치를 predefine 해야함


class State extends React.Component {
  constructor(props) {
    super(props);

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
      counties: [],
      prevLocation: "",
      confirmed: true,
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

    try {
      await fetch(`/usCovid`).then((response) =>
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
    }
  }

  onTextChanged = (e) => {
    let countiesList = [];
    this.state.counties.forEach((element) =>
      countiesList.push(element.city + ", " + element.province)
    );

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
        {/*<div className="stats">
          recovered:{" "}
          {this.state.stateStat[0].confirmed -
            this.state.stateStat[0].deaths -
            this.state.stateStat[0].active}
        </div>*/}
        <div className="stats">
          last updated: {this.state.stateStat[0].lastUpdate}
        </div>
      </div>
    );
  }

  renderGraph() {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const dataConfirmed = [
      {
        text: `${this.state.state.toUpperCase()} AVERAGE`,
        value: this.state.stateStat[0].confirmed,
      },
      { text: "US AVERAGE", value: this.state.usStats[0].confirmed / 50 },
    ];
    const dataDeaths = [
      {
        text: `${this.state.state.toUpperCase()} AVERAGE`,
        value: this.state.stateStat[0].deaths,
      },
      {
        text: "US AVERAGE",
        value: this.state.usStats[0].deaths / 50,
      },
    ];

    return (
      <BarChart
        ylabel="Quantity"
        width={500}
        height={500}
        margin={margin}
        data={this.state.confirmed === true ? dataConfirmed : dataDeaths}
      />
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
            {this.state.state.toUpperCase()} COVID-19 Stats
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
            {this.updateSuggestion()}
          </div>
        </div>
        <div className="centerStats">
          {this.state.isLoading === false ? this.renderStateStats() : ""}
        </div>
        <div className="button">
          <Button
            className="btn-graph"
            variant="primary"
            onClick={() => this.setState({ confirmed: !this.state.confirmed })}
          >
            {this.state.confirmed === true
              ? "View Death Graph"
              : "View Confirmed Graph"}
          </Button>
        </div>
        <div className="graph">
          {this.state.isLoading === false && this.state.usStatsLoading === false
            ? this.renderGraph()
            : ""}
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
