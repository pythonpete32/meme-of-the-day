import React, { Component } from 'react';
import './App.css';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buffer: null,
      memeHash: `QmcEsejpGhrEKoNnFar4kvbCTaoFno2XhAXCWjEUq4ucJX`
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
  submitFile = (event) => {
    event.preventDefault()
    console.log("Submitting file to ipfs...")
    ipfs.add(this.state.buffer, async (error, result) => {
      console.log('Ipfs result', result)
      const memeHash = await result[0].hash
      this.setState({ memeHash })
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
                  <img src={`https://ipfs.io/ipfs/${this.state.memeHash}`} />
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
