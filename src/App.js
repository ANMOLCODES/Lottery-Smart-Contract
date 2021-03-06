import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from './web3';
import lottery from './lottery'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {manager: '', players: [], balance: '', value: '', message: ''};
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

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction success...'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    }); 

    this.setState({message: 'You have been entered!'});
  };

  onClick = async () =>{
    const accounts = await web3.eth.getAccounts();
    
    this.setState({message: 'Picking a winner...'})

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    }); //pickWinner() is a read only function so we are not sending any money during this transaction as compared to enter() method above in which we did have to send a specific amount of eth to call that function, specified in our contract lottery.sol

    this.setState({message: 'A winner has been successfully picked!'})

  };

  render() {
    return (
      <div>
        <h2>Loterry Contract</h2>
        <p>this Contract is managed by {this.state.manager} </p>
        <p>There are currently {this.state.players.length} people entered, competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>
        
        <hr />

        <form onSubmit = {this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of Ether to enter</label>
            <input
              value = {this.state.value} 
              onChange= {event => this.setState({value: event.target.value}) } 
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
        <hr />


        <h1>{this.state.message}</h1>

      </div>
    );
  }
}
export default App;
