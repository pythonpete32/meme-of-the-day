pragma solidity 0.5.8;

/*
*   Stores the ipfs hash of memes
*/
contract Meme {

    string hash;

    function setState(string calldata _hash) external {
        hash = _hash;
    }

    function getState() public view returns(string memory) {
        return hash;
    }
}