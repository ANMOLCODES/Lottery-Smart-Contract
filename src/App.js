import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from './web3';
import lottery from './lottery'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {manager: '', players: [], balance: ''};
  } //entire constructor function can be replaced with the code given below thanks to ECMA script
  // state = {               another way of initialising state
  //   manager: '' 
  // };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager: manager, players: players, balance: balance});
  }
  render() {
    return (
      <div>
        <h2>Loterry Contract</h2>
        <p>this Contract is managed by {this.state.manager} </p>
        <p>There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>
      </div>
    );
  }
}
export default App;
