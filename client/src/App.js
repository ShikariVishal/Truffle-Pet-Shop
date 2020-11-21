import React, { Component } from "react";
import PetShop from "./contracts/PetShop.json";
import getWeb3 from "./getWeb3";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import BuyPet from "./Modals/BuyPet.js";

import "./App.css";

let breed = new Map()
breed.set(0, 'German Shepherd')
breed.set(1, 'Bulldog')
breed.set(2, 'Labrador')
breed.set(3, 'Husky')

let status = new Map()
status.set(0, 'unsold')
status.set(1, 'sold')

class App extends Component {
  state = {
      loaded: false,
      pets:[]
   };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.deployedNetwork = PetShop.networks[this.networkId];
      this.instance = new this.web3.eth.Contract(
        PetShop.abi,
        this.deployedNetwork && this.deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ loaded: true}, this.getData);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  getData = async() => {
    var pets = await this.instance.methods.getPets().call({from: this.accounts[0]});
    this.setState({pets});
  }

  Buy = async(event) => {
    const inputId = event.target.id;
    const petRate = (this.state.pets[inputId]).rate;
    const Ether = 1000000000000000000;
    await this.instance.methods.buyPet(inputId).send({from: this.accounts[0], value: petRate*Ether});
    window.location.reload();
  }

  render() {

    const pets = this.state.pets;
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className='Header'>
          <h1>Magic Pet Store</h1>
          <BuyPet object={this}></BuyPet>
        </div>
        <div className="CardsHead">
          {pets !== [] ? pets.map((item, key) => (
            <Card className="Card">
              <Card.Img variant="top" src={require('./images/'+item.breed+'.jpg')} className="CardImage"/>
              <Card.Body>
                <Card.Title>{breed.get(parseInt(item.breed))}</Card.Title>
                <Card.Text>
                  Age : {item.age}<br/> 
                  Rate : {item.rate}<br/>
                  Status : {status.get(parseInt(item.status))}
                </Card.Text>
                <Button variant="primary" id={item.index} onClick={this.Buy}>Buy</Button>
              </Card.Body>
            </Card>
          )) :null}
        </div>
      </div>
    );
  }
}

export default App;


          // <Card className="Card">
          //   <Card.Img variant="top" src={require('./images/0.jpg')} className="CardImage"/>
          //   <Card.Body>
          //     <Card.Title>Card Title</Card.Title>
          //     <Card.Text>
          //       Some quick example text to build on the card title and make up the bulk of
          //       the card's content.
          //     </Card.Text>
          //     <Button variant="primary">Go somewhere</Button>
          //   </Card.Body>
          // </Card>

