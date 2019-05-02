import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      input: "",
      beliefBase: []
    }

  }

  addBelief() {
    let newBelief = this.state.beliefBase;
    newBelief.push(this.state.input);
    this.setState({ beliefBase: newBelief })

  }
  render() {
    return (
      <div className="App">
        <div className="App-content">
          <div className="left-panel">
            <button onClick={this.addBelief.bind(this)}>Add belief </button>
            <textarea onChange={(e) => this.setState({ input: e.target.value })} placeholder="Insert beliefs in propositional logic form" />
          </div>
          <div className="right-panel">
            <h1>Belief base</h1>
            {this.state.beliefBase.map((b) => b + "\n")}</div>

        </div>
      </div>
    );
  }

}

export default App;
