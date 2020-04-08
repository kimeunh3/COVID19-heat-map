import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import img from "./Blank_US_Map.svg";

class State extends React.Component {
  /*constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      stats: [],
      location: "",
      countyStats: null
    };
  }

  async componentDidMount(){
    try{
      await fetch('/stateCovid').then(response => 
          response.json().then(data => ({
              data: data,
              status: response.status,
          })
      ).then(res => {
          this.setState({ stats: res.data,
                          isLoading: false})
          //console.log(this.state.stats)
    }));
    }catch (e) {
      alert(e);
    }
  }

  handleChange = event => {
    console.log("location: ", this.state.location);
    this.setState({
      location: event.target.value
    });
  }

  async handleClick() {
    let city = this.state.location.split(" ")[0];
    let state = this.state.location.split(" ")[1];

    try{
      await fetch(`/cityCovid?city=${city}&state=${state}`).then(response => 
          response.json().then(data => ({
              data: data,
              status: response.status,
          })
      ).then(res => {
          this.setState({ countyStats: res.data})
          console.log(this.state.countyStats)
    }));
    }catch (e) {
      alert(e);
    }
  }*/

  render() {
    return (
      <div>
        <div className="header">
          <h1 className="title">State COVID19 Stats</h1>
          여기도 느낌적인 늒임 수정 부탁
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
