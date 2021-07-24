import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';

class App extends Component {

  async componentWillMount() {

      await this.loadWeb3()
      await this.loadAccounts()
  }

  async loadWeb3() {

      if(window.ethereum){

          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
      }
      else if(window.web3){

          window.web3 = new Web3(window.web3.currentProvider)
      }
      else{

          window.alert("It seems you're using a browser that does not support Ethereum. Try MetaMask, okay?")
      }
  }

  async loadAccounts(){

      const web3 = window.web3

      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })
  }

  constructor(props){

      super(props)

      this.state = {

          account: ''
      }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">

          <a className="navbar-brand col-sm-3 col-md-2 mr-0" target="_blank" rel="noopener noreferrer" style = {{marginLeft: '1em'}}> Color Tokens </a>
          <span id = "account" style = {{marginRight: '1em', color: 'white'}}>{this.state.account} </span>

        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">



              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
