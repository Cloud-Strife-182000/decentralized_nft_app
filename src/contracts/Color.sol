pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract Color is ERC721Full{

    string[] public colors;
    mapping(string => bool) existingColors;

    constructor() ERC721Full("Color", "COLOR") public {

    }

    function mint(string memory _color) public {

        //check if color exists
        require(!existingColors[_color]);

        //if it's unique, mint it
       uint index = colors.push(_color);
       _mint(msg.sender, index);
       existingColors[_color] = true;
    }

}