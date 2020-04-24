import React from "react";
//import ReactDOM from "react-dom";
import "./Home.css";
import { Link } from "react-router-dom";
import BarChart from "react-bar-chart";
import Error from "./imgs/error.png";

//  Eunhye:
//  TO DO: add image on error handling pop up
//  TO DO: deaths graph

//  Ash:
//  DONE: some counties stopped working. A more relaxed regex is applied


class County extends React.Component {
  constructor(props) {
    super(props);

    let search = window.location.search;
    let param = search.toString().split("=")[1].replace(/%20/g, " ");

    this.state = {
      isLoading: true,
      isStateLoading: true,
      county: param.split(", ")[0],
      state: param.split(", ")[1],
      location: "",
      countyStat: null,
      stateStat: null,
      prevState: undefined,
      prevCounty: undefined,
      prevLocation: "",
      suggestions: [],
      counties: [],
      validInput: true,
      popup: false,
    };

    this.refresh = this.refresh.bind(this);

    //console.log(this.state.county)
    //console.log(this.state.state)
  }

  componentDidMount() {
    console.log(this.state.county, this.state.state);
    try {
      fetch(
        `/countyCovid?county=${this.state.county}&state=${this.state.state}`
      ).then((response) =>
        response
          .json()
          .then((data) => ({
            data: data,
            status: response.status,
          }))
          .then((res) => {
            if (res.data.details === undefined) {
              this.setState({ countyStat: res.data, isLoading: false });
            } else {
              this.setState({ validInput: false, popup: true });
            }
          })
      );
    } catch (e) {
      this.setState({ found: false });
      alert(e);
    }
  }

  componentDidUpdate() {
    if (this.state.prevCounty !== this.state.county) {
      try {
        fetch(
          `/countyCovid?county=${this.state.county}&state=${this.state.state}`
        ).then((response) =>
          response
            .json()
            .then((data) => ({
              data: data,
              status: response.status,
            }))
            .then((res) => {
              if (res.data.details === undefined) {
                this.setState({ countyStat: res.data, isLoading: false });
              } else {
                this.setState({ validInput: false, popup: true });
              }
            })
        );
      } catch (e) {
        alert(e);
      }
      this.setState({
        prevCounty: this.state.county,
      });
    }

    if (this.state.prevState !== this.state.state) {
      try {
        fetch(`/stateCovid?state=${this.state.state}`).then((response) =>
          response
            .json()
            .then((data) => ({
              data: data,
              status: response.status,
            }))
            .then((res) => {
              this.setState({ stateStat: res.data, isStateLoading: false });
            })
        );
      } catch (e) {
        alert(e);
      }
      this.setState({
        prevState: this.state.state,
      });
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

  refresh() {
    let County = this.state.location.split(", ")[0];
    let State = this.state.location.split(", ")[1];

    this.setState({
      county: County,
      state: State,
      isLoading: true,
      isStateLoading: true,
    });
  }

  togglePopup() {
    this.setState({
      popup: false,
    });
  }

  renderCountyStats() {
    return (
      <div className="centerStats">
        <div className="stats">
          confirmed: {this.state.countyStat.confirmed}
        </div>
        <div className="stats">deaths: {this.state.countyStat.deaths}</div>
        <div className="stats">
          last updated: {this.state.countyStat.lastUpdate}
        </div>
      </div>
    );
  }

  renderGraph() {
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const dataConfirmed = [
      { text: this.state.county.toUpperCase(), value: this.state.countyStat.confirmed },
      {
        text: `${this.state.state.toUpperCase()} AVERAGE`,
        value:
          this.state.stateStat[0].confirmed / this.state.stateStat[0].numCounty,
      },
    ];
    const dataDeaths = [
      { text: this.state.county, value: this.state.countyStat.deaths },
      {
        text: `${this.state.state.toUpperCase()} AVERAGE`,
        value:
          this.state.stateStat[0].deaths / this.state.stateStat[0].numCounty,
      },
    ];
    return (
      <BarChart
        ylabel="Confirmed"
        width={500}
        height={500}
        margin={margin}
        data={dataConfirmed}
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
            {this.state.county === undefined ? 'empty' :  this.state.county.toUpperCase()}{" "}
            {this.state.state === undefined ? 'empty' : this.state.state.toUpperCase()}{" "}
            <br></br>
            COVID19 Stats
          </h1>
          <div>
            {this.state.validInput === false && this.state.popup === true ? (
              <Popup
                text=<p>
                  {this.state.county === undefined ? 'empty' :  this.state.county.toUpperCase()}{" "}
                  {this.state.state === undefined ? 'empty' : this.state.state.toUpperCase()} is not a valid county.
                  Please enter a different county.
                </p>
                closePopup={this.togglePopup.bind(this)}
              />
            ) : null}
          </div>
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
            <button onClick={this.refresh} className="btn-search">
              Search
            </button>
            {this.updateSuggestion()}
          </div>
        </div>
        <div>
          {this.state.isLoading === false ? this.renderCountyStats() : ""}
        </div>
        <div className="graph">
          {this.state.isLoading === false && this.state.isStateLoading === false
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

class Popup extends React.Component {
  render() {
    return (
      <div className="popup">
        <div className="popup_inner">
          <h1>{this.props.text}</h1>
          <button onClick={this.props.closePopup}>close me</button>
        </div>
      </div>
    );
  }
}

export default County;
