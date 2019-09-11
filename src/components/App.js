import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Meme from '../abis/Meme.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      contract: null,
      buffer: null,
      memeHash: `QmNWEkZi3GjoFHKXK49waPZD22k6zb3o7s7xQTA8GLURbt`
    }
  }

  // lifecycle method. refactor to hooks 
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockChainData()
  }

  async loadBlockChainData() {
    const web3 = await window.web3
    const account = await web3.eth.getAccounts()
    const network = await web3.eth.net.getId()
    const networkData = Meme.networks[network]
    console.log(networkData)
    if (networkData) {
      const abi = Meme.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi, address)
      this.setState({ contract: contract })
      const IPFShash = await contract.methods.getState().call()
      this.setState({ memeHash: IPFShash })
    } else {
      window.alert('contract not deployed to dected network')
    }
    this.setState({ account: account[0] })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('install metamask')
    }

  }

  captureFile = (event) => {
    event.preventDefault()
    // process file for ipfs
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      console.log('buffer', Buffer(reader.result))
      this.setState({ buffer: Buffer(reader.result) })
    }
  }

  // example: "QmcEsejpGhrEKoNnFar4kvbCTaoFno2XhAXCWjEUq4ucJX"
  // example url: https://ipfs.io/ipfs/QmcEsejpGhrEKoNnFar4kvbCTaoFno2XhAXCWjEUq4ucJX/
  // refactor this to handle the error properly
  submitFile = async (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, async (error, result) => {
      console.log('Ipfs result', result)
      const memeHash = await result[0].hash
      if (error) {
        console.error(error)
        return
      }
      // step2: store file on blockchain
      const contract = this.state.contract
      contract.methods.setState(memeHash).send({ from: this.state.account })
        .then((result) => {
          this.setState({ memeHash })
        })
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://DAOresear-ch.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meme of the Day
          </a>
          <ul className="navbar-nav px-4">
            <li className="nav-item "> {/* text-nowrap d-none d-sm-none d-sm-block */}
              <small className="text-white">
                {this.state.account}
              </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://DAOresear-ch.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={`https://ipfs.io/ipfs/${this.state.memeHash}`} />
                </a>
                <form onSubmit={this.submitFile}>
                  <p>&nbsp;</p> {/* non breaking space*/}
                  <h2>Meme of the Day</h2>
                  <input type='file' onChange={this.captureFile} />
                  <input type='submit' />
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
