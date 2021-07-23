import React, { Component } from 'react';
import Web3 from 'web3';
import NFTCheeseTouch from '../abis/NFTCheeseTouch.json'

import Navbar from './Navbar';
import Main from './Main';

class App extends Component {

  // Declare component variables.
  constructor(props) {
    super(props)

    this.state = {
      acccount: null,
      contractObject: null,
      contractData: null,
      buffer: null,
      loading: true,
    }

    // If i recall correctly, binding wasn't necessary if the function is a lambda, but let's just do it just in case.
    this.transfer = this.transfer.bind(this)
    this.mint = this.mint.bind(this)
  }


  // |-- ON-LOAD FUNCTIONS --|
  // This function will be executed at start.
  async componentWillMount() {
    this.setState({ loading: true });
    await this.loadWeb3()
    await this.loadBlockchainData()
    this.setState({ loading: false });
  }

  // Loads the web3 drive / wallet.
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3)
      window.web3 = new Web3(window.web3.currentProvider)
    else
      window.alert('No web driver / wallet detected in your browser. You should consider trying MetaMask!')
  }

  // Loads the current account, and contract / network data.
  async loadBlockchainData() {
    const web3 = window.web3

    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = NFTCheeseTouch.networks[networkId]

    if (networkData) {
      // Creates a new instance of the contract linked to web3.
      const contractObject = new web3.eth.Contract(NFTCheeseTouch.abi, networkData.address)

      // Grab the initial data, public contract attributes have a getter method created for them implicitly.
      let contractData = {
        lastTransferedDate: await contractObject.methods.lastTransferedDate().call(),
        userCounter: await contractObject.methods.userCounter().call(),
        transferHistory: [],
      };

      for (let i = 1; i <= contractData.userCounter; i++) {
        contractData.transferHistory.push(await contractObject.methods.transferHistory(i).call())
      }

      // Store data to component state.
      this.setState({ contractObject })
      this.setState({ contractData })
    } else
      window.alert('Contract not deployed to detected network.')

    this.setState({ loading: false })
  }



  // |-- LIVE FUNCTIONS --|
  // Mint the token, a fresh slice of cheese! and the only one there will be.
  mint = () => {
    this.setState({ loading: true })

    this.state.contractObject.methods.mint()
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({ loading: false })
        window.location.reload()
      }).on('error', () => {
        this.setState({ loading: false })
      });
  }

  // Transfer the slice of cheese.
  transfer = (address) => {
    this.setState({ loading: true })

    this.state.contractObject.methods.transfer(address)
      .send({ from: this.state.account })
      .on('transactionHash', (hash) => {
        this.setState({ loading: false })
        window.location.reload()
      })
      .on('error', () => {
        this.setState({ loading: false })
      });
  }



  // |-- RENDER COMPONENTS --|
  render() {
    return (
      <div>

        {this.state.loading
          ?
          <div id="loader" className="text-center mt-5">
            <img src="https://codemyui.com/wp-content/uploads/2017/11/solid-colour-slide-puzzle-style-loading-animation.gif" alt="loading gif" />
            <p>Loading...</p>
          </div>
          :
          <div>
            <Navbar account={this.state.account} />

            <Main
              account={this.state.account}
              contractData={this.state.contractData}
              mint={this.mint}
              transfer={this.transfer}
            />
          </div>
        }

      </div>
    );
  }
}

export default App;
