import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import img from "./Blank_US_Map.svg";
import ReactSearchBox from "react-search-box";

class Test extends React.Component {
  render() {
    return (
      <div>
        <div class="header">
          <h1 class="title">US COVID19 Stats</h1>
          <ReactSearchBox
            placeholder="Search"
            value=""
            // data={this.data}
            // callback={record => console.log(record)}
          />
        </div>
        <div class="map">
          <img src={img} />
        </div>
        <div class="link">
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
