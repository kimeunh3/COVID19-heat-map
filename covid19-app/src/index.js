import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import img from "./Blank_US_Map.svg";

class Test extends React.Component {
  constructor(props) {
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
          //console.log(this.state.countyStats)
    }));
    }catch (e) {
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
              <input type="location" name = "location" value = {this.state.location} placeholder="place" onChange={this.handleChange}/>
            </form>
            //이거 css 부탁행
            <button onClick={() => {this.handleClick()}}>
              Enter
            </button>
          </div>
        </div>
        <div className="map">
          {this.props.isLoading === true ? 'error' : <img src={img} />}
          {this.state.stats.map(el => (
            <li key={el._id}>
              {el._id}: {el.confirmed}, {el.deaths}, {el.recovered}
            </li>
          ))}
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
