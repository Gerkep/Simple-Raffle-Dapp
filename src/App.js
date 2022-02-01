import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";
class App extends React.Component {

  state = { manager: '', players: [], balance: '', value: '', message: ''};

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager: manager, players: players, balance: balance})
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction success...'});
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: 'You entered!'})
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction success...'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({message: 'A winner has been picked!'});
  };

  render() {

    return (
      <div>
        <h2>Enter the raffle!</h2>
        <p>This contract is managed by: {this.state.manager}</p>
        <p>There are currently {this.state.players.length} people competing to win {web3.utils.fromWei(this.state.balance, 'ether')} eth!</p>
        <hr/>
        <form onSubmit={this.onSubmit}>
          <h3>Want to try your luck?</h3>
          <input
            value={this.state.value}
            onChange={e => this.setState({value: e.target.value})}
          /><br/>
          <button>Enter</button>
        </form>
        <hr />
          <h4>Ready to pick a winner?</h4>
          <button onClick={this.onClick}>Pick a winner!</button>
          <hr/>
        <h2>
          {this.state.message}
        </h2>
      </div>
    );
  }
}
export default App;
