pragma solidity 0.5.0;

contract MemeKing {
    address payable public currentKing;
    uint public currentPrice = 0;
    string memeHash = "QmR1viabpkRWpbbkjZHnchNhj54oXSjvMY6iK1BSf1XkCA";

    function kingMe(string memory _hash) payable public {
        // new price must be 10% greater than current
        uint minimumPrice = currentPrice * 11/10;
        require(msg.value > minimumPrice);
        // document new king
        address payable previousKing = currentKing;
        currentKing = msg.sender;
        currentPrice = msg.value;
        // payout previous king
        previousKing.transfer(msg.value);

        // set new memeHash
        setMemeHash(_hash);
    }

    function setMemeHash(string memory _hash) public {
        memeHash = _hash;
    }

    function getMemeHash() public view returns(string memory) {
        return memeHash;
    }
}