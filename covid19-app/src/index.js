import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import img from "./Blank_US_Map.svg";

class Test extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      stats: '',
      location: this.props.value
    };
  }

  componentDidMount(){
    //  TO DO: connect backend and implement heat-map
    try{
      let p1 = fetch('/stateCovid', {mode:"no-cors"})
      .then(({ results }) => this.setState({ stats: results }));
    }catch (e) {
      alert(e);
    }
    console.log("stats: ", this.stats);
    this.setState({ isLoading: false });
  }

  handleChangeValue(value){
    this.setState({selectedValue: value});
  }

  handleClick() {
    //  TO DO: connect backend
    try{
      fetch('/cityCovid')
        .then(({ results }) => this.setState({ stats: results }));
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
