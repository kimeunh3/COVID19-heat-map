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
      location: this.props.value
    };
  }

  async componentDidMount(){
    //  TO DO: solve backend
    try{
      await fetch('/stateCovid').then(response => 
          response.json().then(data => ({
              data: data,
              status: response.status,
          })
      ).then(res => {
          this.setState({ stats: res.data,
                          isLoading: false})
          console.log(res)
    }));
    }catch (e) {
      alert(e);
    }

    {this.isLoading == false ? console.log(this.state.stats) : console.log('waiting')}
  }

  handleChangeValue(value){
    this.setState({selectedValue: value});
  }

  handleClick() {
    //  TO DO: connect backend
    let city = this.state.location.split(" ")[0];
    let state = this.state.location.split(" ")[1];
    try{
      fetch(`/cityCovid?city=${city}?state=${state}`)
        .then(({ results }) => this.setState({ stats: results })); //need to pass data to new page
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
              <input type="text" name = "location" value = {this.state.location} placeholder="place" onChange={() => {this.handleChangeValue(this.state.location);}}/>
            </form>
            //이거 css 부탁행
            <button onClick={this.handleClick}>
              Enter
            </button>
          </div>
        </div>
        <div className="map">
          {this.props.isLoading === true ? 'error' : <img src={img} />}
          {this.state.stats.map(el => (
            <li>
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
