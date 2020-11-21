pragma solidity ^0.6.6;
pragma experimental ABIEncoderV2;

contract PetShop {
    enum Breed { German_Shepherd, Bulldog, Labrador, Husky }
    enum Status {unsold, sold}
    mapping(Breed => string) breedLinks;
    
    struct pet {
        uint rate;
        Status status;
        Breed breed;
        uint age;
        address payable owner;
        uint index;
    }
    
    pet[] pets;
    
    uint index = 0;
    
    function getPets() public view returns(pet[] memory) {
        return pets;
    }
    
    function addPet(uint _rate, Breed _breed, uint _age) public payable{
        pets.push(pet({
            rate: _rate,
            breed: _breed,
            age: _age,
            owner: msg.sender,
            status: Status.unsold,
            index: index++
        }));
    }
    
    function buyPet(uint _index) public payable {
        require(pets[_index].status == Status.unsold, "This pet has already been sold");
        require(msg.value >= (pets[_index].rate), "We don't accept partial payments");
        (pets[_index].owner).transfer(pets[_index].rate);
        pets[_index].status = Status.sold;
        pets[_index].owner = msg.sender;
    }
    
}
