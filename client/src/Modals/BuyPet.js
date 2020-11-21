import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import "./BuyPet.css";

export default function BuyPet(props) {
    const [show, setShow] = useState(false);
    const [breed, setBreed] = useState("0");
    const [age, setAge] = useState("1");
    const [rate, setRate] = useState("");

    const [breedError, setBreedError] = useState("");
    const [ageError, setAgeError] = useState("");
    const [rateError, setRateError] = useState("Please set rate.");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const handleChange = event => {
        const value = event.target.value;
        const inputId = event.target.id;

        if(inputId === "breed") {
            if(parseInt(value) >= 0 && parseInt(value) < 4) {
                setBreed(value);
                setBreedError("");
            }
            else {
                setBreed("");
                setBreedError("Please select a breed");
            }
        }
        else if(inputId === "age") {
            if(parseInt(value) > 0 && parseInt(value) < 4) {
                setAge(value);
                setAgeError("");
            }
            else {
                setAge("");
                setAgeError("Please select age");
            }
        }
        else if(inputId === "rate") {
            if(value - parseInt(value)) {
                setRateError("Please set rate in Ethers");
                setRate("");
            }
            else {
                if(parseInt(value) > 0) {
                    setRateError("");
                    setRate(value);
                } 
                else {
                    setRateError("Please set rate.");
                    setRate("");
                }
            }
        }

    }

    const submit = async(event) => {
        
        const parentObject = props.object;
        const valid = (
            breed !== "" && breedError === "" &&
            age !== "" && ageError === "" &&
            rate !== "" && rateError === ""
        )
        
        if(valid) {
            console.log(`breed = ${breed}, age = ${age}, rate = ${rate}`);
            let account = await parentObject.accounts[0]; 
            const Ether = 1000000000000000000;
            await parentObject.instance.methods.addPet((rate), (breed), (age)).send({from: account, value: Ether});
            handleClose();
            window.location.reload();
        }
    }

    return (
      <>
        <Button variant="warning" onClick={handleShow}>
          Sell
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Sell a Pet</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* take breed i/p */}
            {/* take age i/p */}
            {/* take rate i/p */}
            
            <Form>
                <Form.Group controlId="breed">
                    <Form.Label>Breed :</Form.Label>
                    <Form.Control as="select" custom onChange={handleChange}>
                        <option selected value="0">German Shepherd</option>
                        <option value="1">Bulldog</option>
                        <option value="2">Labrador</option>
                        <option value="3">Husky</option>
                    </Form.Control>
                    { breedError.length > 0 && <span className="error">{breedError}</span> }
                </Form.Group>

                <Form.Group controlId="age">
                    <Form.Label>Age :</Form.Label>
                    <Form.Control as="select" custom onChange={handleChange}>
                        <option selected value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </Form.Control>
                    { ageError.length > 0 && <span className="error">{ageError}</span> }
                </Form.Group>

                <Form.Group controlId="rate">
                  <Form.Label>Rate :</Form.Label>
                  <Form.Control type="number" required step=".000000000000000001" placeholder="Enter rate in ETH" onChange={handleChange} autocomplete="off" />
                  { rateError.length > 0 && <span className="error">{rateError}</span> }
                </Form.Group>
            </Form>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={submit} type="Submit">
              Sell
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
//   render(<BuyPet />);