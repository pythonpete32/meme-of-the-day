import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buffer: null,
      memeHash: ``
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

  // example: "QmUPeUc81UNzhjDx1M9y3Ni67YUFWK53PvZxMRpW4PTRhJ"
  // example url: http://localhost:5001/ipfs/QmUPeUc81UNzhjDx1M9y3Ni67YUFWK53PvZxMRpW4PTRhJ
  submitFile = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('Ipfs result', result)
      if (error) {
        console.error(error)
        return
      }

      // step2: store file on blockchain
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
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <form onSubmit={this.submitFile}>
                  <p>&nbsp;</p> {/* non breaking space*/}
                  <h2>MINE</h2>
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
