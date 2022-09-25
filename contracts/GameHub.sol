//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
  

import "@openzeppelin/contracts/access/Ownable.sol";

// Creating a Smart Contract
contract GameHub is Ownable {
  
   // Structure of game
   struct Game{
       // State variables
       uint256 gameid;
       string name;
       string ipfsURI;
       string link;
   }
   
   Game []game;
   uint256 public totalGames;

   constructor() {
    totalGames = 0;
   }
  
   // Function to add 
   // game details
   function addGame(string memory name, string memory ipfsURI, string memory link) public onlyOwner {
        uint256 gameid = totalGames;
        Game memory e= Game(gameid,name,ipfsURI,link);
        game.push(e);
        totalGames = totalGames + 1;
   }
  
  // Function to get
  // details of game
   function getGame(uint256 gameid) public view returns(string memory, string memory, string memory){
       uint256 i;
       for(i=0;i<totalGames;i++)
       {
           Game memory e=game[i];
           if(e.gameid==gameid)
           {
                  return(e.name, e.ipfsURI, e.link);
           }
       }
       
     // If provided game id is not presentit returns Not Found
     return("Not Found", "Not Found", "Not Found");
   }
}