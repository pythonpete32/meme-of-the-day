import React, { useEffect, useState } from 'react';

import { Heading, Box } from "rimble-ui";

import Header from './components/Header.js';
import MemeCard from './components/MemeCard.js';

import Web3 from 'web3';
import MemeKing from './contracts/MemeKing.json'

function App() {
  const [account, setAccount] = useState('')
  const [contract, setContract] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)

  // comnponent will mount
  useEffect(() => {
    console.log('component mounted')
    loadWeb3()
    loadBlockChainData()
  }, []);

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('install metamask')
    }

  }

  async function loadBlockChainData() {
    const web3 = await window.web3
    const account = await web3.eth.getAccounts()
    const network = await web3.eth.net.getId()
    const networkData = MemeKing.networks[network]
    if (networkData) {
      const abi = MemeKing.abi
      const address = networkData.address
      const loadedContract = web3.eth.Contract(abi, address)
      setContract(loadedContract)

      /* move this logic to child component
      const IPFShash = await contract.methods.getState().call()
      this.setState({ memeHash: IPFShash })
      */
    } else {
      window.alert('contract not deployed to detected network')
    }
    setAccount(account[0])
    setDataLoaded(true)
  }


  return (
    <div>
      <Box >
        <Header />
        <Heading.h1>Some Headline Text</Heading.h1>
        {dataLoaded ? <MemeCard contract={contract} account={account} /> : <Heading.h2>Loading....</Heading.h2>}

      </Box>


    </div >

  );
}

export default App;
