//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract FrensHub is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Profile {
        uint tokenID;
        string handle;
        uint256[] frens;
        uint256 totalFrens;
    }

    Profile[] public profiles;

    enum FREN_STATUS {NONE, PENDING, ACCEPT, BLOCK }

    mapping(uint256 => mapping(uint256 => FREN_STATUS)) public frenStatus;
    
    mapping(string => bool) handleTaken;
    mapping(string => uint256) public nftForHandle;

    mapping(address => uint256) public profileIDs;

    constructor() ERC721("FrensNFT", "FNFT") {
        uint256[] memory newFrens;
        profiles.push(
            Profile(
                0,
                "null",
                newFrens,
                0
            )
        );
    }

    function createProfile(string memory handle)
        public 
        returns (uint256)
    {   
        _tokenIds.increment();

        require(!handleTaken[handle], "handle Taken");

        uint256 newItemId = _tokenIds.current();

        uint256[] memory newFrens;

        profiles.push(
            Profile(
                newItemId,
                handle,
                newFrens,
                0
            )
        );

        handleTaken[handle] = true;
        nftForHandle[handle] = newItemId;
        profileIDs[msg.sender] = newItemId;
        _mint(msg.sender, newItemId);


        return newItemId;        
    }

    function requestFrens(uint256 _profileID) public {

        uint _userProfileID = profileIDs[msg.sender];
        
        require(_userProfileID != _profileID, "Cannot Add self as fren");

        require(frenStatus[_profileID][_userProfileID] != FREN_STATUS.BLOCK || 
                frenStatus[_profileID][_userProfileID] != FREN_STATUS.ACCEPT, "Unable to send request");
        
        FREN_STATUS status = frenStatus[_profileID][_userProfileID];

        FREN_STATUS newStatus;
        if(status == FREN_STATUS.PENDING) {
            newStatus  = FREN_STATUS.ACCEPT;
            Profile storage profile = profiles[_profileID];
            Profile storage profile1 = profiles[_userProfileID];
            
            profile.frens.push(_userProfileID);
            profile.totalFrens = profile.totalFrens + 1;

            profile1.frens.push(_profileID);
            profile1.totalFrens = profile1.totalFrens + 1;


        } else {
            newStatus = FREN_STATUS.PENDING;
        }

        frenStatus[_profileID][_userProfileID] = newStatus;
        frenStatus[_userProfileID][_profileID] = newStatus;
        
    }

    function totalFrens(uint256 _profileID) public view returns(uint256) {
        Profile memory profile = profiles[_profileID];
        return profile.totalFrens;
    }
    function whoFren(uint _profilelID, uint256 _index) public view returns(uint256) {
        Profile memory profile = profiles[_profilelID];
        return profile.frens[_index];
    }

    function getProfile(uint _profileID) public view returns(   uint tokenID,
        string memory handle,
        uint256 totalFrens) {

        Profile memory profile = profiles[_profileID];
        handle = profile.handle;
        tokenID = profile.tokenID;
        totalFrens = profile.totalFrens;         
    }


}
