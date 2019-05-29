import React from 'react';
import logo from './logo.svg';
import './App.css';
import revisionHelper from './Scripts/Revision'
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      input: "¬PVQ\nP\n¬Q",
      beliefBase: []
    }

  }

  addBelief() {
    let beliefBase = this.state.beliefBase;
    let newBeliefs = this.state.input
    .trim()
    .split("\n");
    let newBelieefToAdd = newBeliefs[0];
    if(newBelieefToAdd){
    revisionHelper.updateBeliefBase(newBelieefToAdd,null, beliefBase)
    console.log('newBlelif', newBeliefs )
   newBeliefs.splice(0,1); //remove the added belief from texarea
   // console.log('newBeliefs.join(n)',newBeliefs.join('\n'))
    this.setState({input: newBeliefs.join('\n'),beliefBase })
    /*
    newBelief.push(this.state.input);
    this.setState({ beliefBase: newBelief })*/

  }
  }
  render() {
console.log('this.state',this.state)
    return (
      <div className="App">
        <div className="App-content">
          <div className="left-panel">
            <button onClick={this.addBelief.bind(this)}>Add belief </button>
            <textarea value={this.state.input} onChange={(e) => this.setState({ input: e.target.value })} placeholder="Insert beliefs in propositional logic form" />
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
