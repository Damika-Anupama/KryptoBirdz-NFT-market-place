// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721.sol";
import './interfaces/IERC721Enumerable.sol';

contract ERC721Enumerable is ERC721, IERC721Enumerable{
    uint256[] private _allTokens;

    // mapping from tokenId to position in _allTokens array
    mapping(uint256 => uint256) private _allTokensIndex;
    // mapping of owner to list of all owner token ids
    mapping(address => uint256[]) private _ownedTokens;
    // mapping from token ID index of the owner tokens list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    constructor() {
        _registerInterface(bytes4(
            keccak256('totalSupply(bytes4)')^
            keccak256('tokenByIndex(bytes4)')^
            keccak256('tokenOfOwnerByIndex(bytes4)')
        ));
    }
    
    function _mint(address to, uint256 tokenId) internal override(ERC721) {
        super._mint(to, tokenId);
        // 2 things
        // A. add tokens to the owner
        // B. all tokens to our totalsupply - to allTokens
        _addTokensToAllTokenEnumeration(tokenId);
        _addTokensToOwnerEnumeration(to, tokenId);
    }

    /// return the total supply of the _allTokens array
    function totalSupply() public view override returns (uint256){
        return _allTokens.length;
    }
    // add tokens to the _allTokens array
    // and set the index of the token id to the length of the array
    function _addTokensToAllTokenEnumeration(uint256 tokenId) private {
       _allTokensIndex[tokenId] = _allTokens.length;
       _allTokens.push(tokenId);
    }

    function _addTokensToOwnerEnumeration(address to, uint256 tokenId) private {
        // 1. add address and token id to the 
        // 2. ownedTokensIndex tokenId set to address of ownedTokens position
        // 3. we want to execute the function with minting
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;
        _ownedTokens[to].push(tokenId);
    } 

    // two functions - one that returns tokenByIndex and 
    // another one that returns toeknOfOwnerByIndex
    function tokenByIndex(uint256 index) external override view returns (uint256){
        // make sure that the index is not out of bounds of the
        // total supply
        require(index < totalSupply(), "ERC721Enumerable: index out of bounds");
        return _allTokens[index];
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) external override view returns (uint256){
        require(index < balanceOf(owner), "ERC721Enumerable: index out of bounds");
        return _ownedTokens[owner][index];
    }

    
}