import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Color from '../abis/Color.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

  async componentWillMount() {

      await this.loadWeb3()
      await this.loadBlockchainData()
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

  async loadBlockchainData(){

      const web3 = window.web3

      const accounts = await web3.eth.getAccounts()
      this.setState({ account: accounts[0] })

      const networkId = await web3.eth.net.getId()
      const networkData = Color.networks[networkId]

      if(networkData){

        const abi = Color.abi
        const address = networkData.address
        const contract = new web3.eth.Contract(abi, address)
        this.setState({ contract })
        const totalSupply = await contract.methods.totalSupply().call()
        this.setState({ totalSupply })

        for(var i=0; i < totalSupply; i++){

          const color = await contract.methods.colors(i).call()

          this.setState({

              colors: [...this.state.colors, color]

          })
        }

        console.log(this.state.colors)

      }
      else{

        window.alert("Smart contract not deployed to this network!")

      }
  }

  constructor(props){

      super(props)

      this.state = {

          account: '',
          contract: null,
          totalSupply: 0,
          colors: [],
          buffer: null,
          hash: ''
      }
  }

  captureFile = (event) => {

        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)

        reader.onloadend = () => {

            this.setState({ buffer: Buffer(reader.result) })
            console.log('buffer', Buffer(reader.result))
        }
  }

  submitFile = (event) => {

        event.preventDefault()
        console.log("Submitting file...")

        ipfs.add(this.state.buffer, (error, result) => {

            console.log("IPFS Result Hash", result[0].hash)
            this.setState({ hash: result[0].hash })

            if(error){

                console.log("IPFS Error")
            }

        })
  }

  displayFile = (event) => {

        event.preventDefault()
        
        var path = "https://ipfs.infura.io/ipfs/"
        path = path + this.state.hash

        window.open(path)

  }

  mint = (color) => {

      this.state.contract.methods.mint(color).send({ from: this.state.account })

      .once("reciept", (reciept) => {

          this.setState({

              colors: [...this.state.colors, color]
          })
      })
  }

  render() {
    return (
      
      <div>

          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">

              <a className="navbar-brand col-sm-3 col-md-2 mr-0" target="_blank" rel="noopener noreferrer" style = {{marginLeft: '1em'}}> Color Tokens </a>
              <span id = "account" style = {{marginRight: '1em', color: 'white'}}>{this.state.account} </span>

          </nav>

          <div className="container-fluid mt-5 mb-5 text-center">

                <h1> Issue Token </h1>

                <form onSubmit={(event) => {

                    event.preventDefault()
                    const color = this.color.value
                    this.mint(color)

                }}>

                <input type='text' className="form-control mb-1 ml-5 mr-5" placeholder="For eg. #FFFFFF" ref={(input) => {this.color = input}}></input>
                <input type='submit' className="btn btn-block btn-primary" value="MINT"></input>
                </form>

                <form onSubmit={this.submitFile}>

                <input type='file' onChange={this.captureFile}/>
                <input type='submit' value="Submit File"/>

                </form>

                <form onSubmit={this.displayFile}>

                <input type='submit' value='display file'/>

                </form>

          </div>

          <div className = "row text-center">

              {this.state.colors.map((color, key) => {
                  return(

                      <div key = {key} className="col-md-3 mb-3">
                          <div className="token" style = {{ backgroundColor: color }}></div>
                          <div>{color}</div>
                      </div>
                  )
              })}

          </div>

      </div>
    );
  }
  
}

export default App;
