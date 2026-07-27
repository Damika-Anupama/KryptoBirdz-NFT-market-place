import React, { Component } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import KryptoBirdz from "../abis/KryptoBirdz.json";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBBtn,
  MDBCardText,
} from "mdb-react-ui-kit";
import "./App.css";

class App extends Component {
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }
  // first check the ethereum provider
  async loadWeb3() {
    const provider = await detectEthereumProvider();
    if (provider) {
      console.log("Ethereum successfully detected!");
      // Request account access so the dApp can read the connected account.
      await provider.request({ method: "eth_requestAccounts" });
      window.web3 = new Web3(provider);
    } else {
      console.log("Please install MetaMask!");
      window.alert("Please install MetaMask to use this dApp.");
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    if (!web3) {
      return; // No provider: nothing to load.
    }

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] }); // Get the first account

    // web3 v4 returns network id as a BigInt; the ABI network map is keyed by string.
    const networkId = (await web3.eth.net.getId()).toString();
    const networkData = KryptoBirdz.networks[networkId];
    if (networkData) {
      const abi = KryptoBirdz.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract: contract });

      // Get the total supply of tokens (BigInt in web3 v4).
      const totalSupply = Number(await contract.methods.totalSupply().call());
      this.setState({ totalSupply: totalSupply });

      // Load Birds, aggregating first to avoid stale-state render thrashing.
      const birds = [];
      for (let i = 0; i < totalSupply; i++) {
        const bird = await contract.methods.kryptoBirdz(i).call();
        birds.push(bird);
      }
      this.setState({ birds });
    } else {
      window.alert("Smart contract not deployed to detected network.");
    }
  }

  mint = (kryptoBird) => {
    this.state.contract.methods
      .mint(kryptoBird)
      .send({ from: this.state.account })
      .on("receipt", () => {
        this.setState((prevState) => ({
          birds: [...prevState.birds, kryptoBird],
        }));
      })
      .on("error", (error) => {
        console.error("Mint failed:", error);
        window.alert("Minting failed. See console for details.");
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      contract: null,
      totalSupply: 0,
      birds: [],
    };
  }
  render() {
    return (
      <div className="container-filled">
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <div
            className="navbar-brand col-sm-3 col-md-3 mr-0"
            style={{ color: "white"}}
          >
            Krypto Birdz NFTs (Non Fungible Tokens)
          </div>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">
                <span id="account">{this.state.account}</span>
              </small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-1">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div
                className="content mr-auto ml-auto"
                style={{ opacity: "0.8" }}
              >
                <h1 style={{ color: "white" }}>
                  KryptoBirdz - NFT Marketplace
                </h1>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    this.mint(this.kryptoBird.value);
                  }}
                >
                  <input
                    type="text"
                    className="form-control mb-1"
                    placeholder="Add a file location"
                    ref={(input) => {
                      this.kryptoBird = input;
                    }}
                  />
                  <input
                    type="submit"
                    className="btn btn-block btn-primary"
                    value="MINT"
                  />
                </form>
              </div>
            </main>
          </div>
          <hr />
          <div className="row textCenter">
            {this.state.birds.map((bird, key) => {
              return (
                <div key={key} className="col-md-3 mb-3">
                  <MDBCard style={{ maxWidth: "30rem" }} className="token img">
                    <MDBCardImage
                    //   src="https://i.ibb.co/RcjtPYC/k1.png"
                      src={bird}
                      position="top"
                      alt="..."
                      style={{ width: "100%", height: "auto" }}
                    />
                    <MDBCardBody>
                      <MDBCardTitle>The Celestial Songbird</MDBCardTitle>
                      <MDBCardText>
                      A rare and enchanting avian marvel that captivates the hearts of all who encounter it. 
                      </MDBCardText>
                        <MDBBtn href="bird">Buy</MDBBtn>
                    </MDBCardBody>
                  </MDBCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;


/* 
image links to use:
https://i.ibb.co/jDJqGbL/k1.png
https://i.ibb.co/349m19j/k2.png
https://i.ibb.co/YRSStdK/k3.png
https://i.ibb.co/54X4rKg/k4.png
https://i.ibb.co/f26bPdm/k5.png
https://i.ibb.co/gvjvDXk/k6.png
https://i.ibb.co/199CWJ4/k7.png
https://i.ibb.co/477YrSh/k8.png
https://ibb.co/J2ZhxdM
https://ibb.co/wKfQ8PS
https://ibb.co/2nc4ZV2
https://ibb.co/bj4DQ8g
https://ibb.co/2WGLj69
https://ibb.co/h2QXn6t
https://ibb.co/XJrPgdJ
 */