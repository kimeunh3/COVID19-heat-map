import React from "react";
//import ReactDOM from "react-dom";
import "./Home.css";
import { Link } from "react-router-dom"; 

// 일단은 이런 그런 느낌적인 느낌 수정 시금....

//  TO DO: css and graphs on the bottom. compare to the national average. //Backend-Ash (Due 04/14)
//Frontend(display) Eunhye

//  TO DO: might be nice to have a logo or something that redirects to the main page //Eunhye (Due 04/14)


//  TO DO: might be nice to have a logo or something that redirects to the main page -Eunhye

class State extends React.Component {
  constructor(props) {
    super(props);

    let search = window.location.search;
    let param = search.toString().split("=")[1].replace(/%20/g, " ")

    this.state = {
      isLoading: true,
      location: "",
      state: param,
      stateStat: [],
    };
  }

  async componentDidMount(){
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

  handleChange = event => {
    //console.log("location: ", this.state.location);
    this.setState({
      location: event.target.value
    });
  }

renderStateStats(){
  //console.log(this.state.stateStat)
    return (
      <div className="centerStats">
        <div className="stats">confirmed:  {this.state.stateStat[0].confirmed}</div>
        <div className="stats">deaths:  {this.state.stateStat[0].deaths}</div>
        <div className="stats">recovered:  {this.state.stateStat[0].recovered}</div>
        <div className="stats">last updated:  {this.state.stateStat[0].lastUpdate}</div>
      </div>
      )
  }


  render() {
    return (
      <div>
        <div className="header">
           <h1 className="title">{this.state.state.toUpperCase()} COVID19 Stats</h1>
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
         <div className="main"><Link to={`/`}>To Main</Link> </div>
        </div>
        <div className = "centerStats">{this.state.isLoading === false ? this.renderStateStats() : "Loading"}</div>
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
