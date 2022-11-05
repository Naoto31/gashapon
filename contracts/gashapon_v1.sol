//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Gashapon_V1 is ERC721URIStorage {

    address payable owner;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listPrice = 0.001 ether; // this is needed when users list their own NFT to market place

    constructor() ERC721("Gashapon_V1", "GASHA") {
        owner = payable(msg.sender);
    }

    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;   
    }

    // This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;

    // update listing price, without this you cannot increase it after deploying smart contract
    function updateListPrice(uint256 _listPrice) public payable {
       require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    // to check current listing price
    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    // get latest token
    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    // get certain token by tokenId
    function getListedForTokenId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    // get current tokenId
    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    
}