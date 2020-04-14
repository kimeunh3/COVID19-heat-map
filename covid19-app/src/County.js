import React from "react";
//import ReactDOM from "react-dom";
import "./Home.css";
import { Link } from "react-router-dom";
import { onTextChanged, suggestionSelected, renderSuggestions } from "./Home";

//{일단은 이런 그런 느낌적인 느낌 수정 시급....}

//  TO DO: Redirect to a different county page from county x working. The url is updated but doesn't redirect. //Ashley
//  TO DO: css and graphs on the bottom. compare to the national average. //Eunhye
//  TO DO: error handling when user input doesn't follow the correct format. <county>, <state> or the data is non-existent //Eunhye

//  TO DO: might be nice to have a logo or something that redirects to the main page //Eunhye (Due 04/14)

//  TO DO: parsing //Ashley (Due 04/14)

class County extends React.Component {
  constructor(props) {
    super(props);
    let search = window.location.search;
    let param = search.toString().split("=")[1];

    this.state = {
      isLoading: true,
      county: param.split(",%20")[0],
      state: param.split("%20")[1],
      location: "",
      countyStat: null,
    };

    //console.log(this.state.county)
    //console.log(this.state.state)
  }

  async componentDidMount() {
    try {
      await fetch(
        `/countyCovid?county=${this.state.county}&state=${this.state.state}`
      ).then((response) =>
        response
          .json()
          .then((data) => ({
            data: data,
            status: response.status,
          }))
          .then((res) => {
            this.setState({ countyStat: res.data, isLoading: false });
            //console.log(this.state.countyStat)
          })
      );
    } catch (e) {
      this.setState({ found: false });
      alert(e);
    }
  }

  handleChange = (event) => {
    //console.log("location: ", this.state.location);
    this.setState({
      location: event.target.value,
    });
  };

  renderCountyStats() {
    return (
      <div className="centerStats">
        <div className="stats">
          confirmed: {this.state.countyStat.confirmed}
        </div>
        <div className="stats">deaths: {this.state.countyStat.deaths}</div>
        <div className="stats">
          recovered: {this.state.countyStat.recovered}
        </div>
        <div className="stats">
          last updated: {this.state.countyStat.lastUpdate}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="header">
          <h1 className="title">
            {this.state.county.toUpperCase()}, {this.state.state.toUpperCase()}{" "}
            COVID19 Stats
          </h1>
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
          <div className="main">
            <Link to={`/`}>To Main</Link>{" "}
          </div>
        </div>
        <div>
          {this.state.isLoading === false
            ? this.renderCountyStats()
            : "Loading"}
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

export default County;
