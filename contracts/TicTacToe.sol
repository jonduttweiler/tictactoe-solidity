//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract TicTacToe {

  int8 constant BOARD_SIZE = 3;
  int8 public turn = -1; //-1 X o 1-O 
  int8[BOARD_SIZE][BOARD_SIZE] public board;
  //ADd enum status - initial - ongoing - finished
  enum GameStatus { initial, ongoing, finished }

  GameStatus public status = GameStatus.initial;

  constructor(){
    console.log("Deploying a Tic tac toe");

    for(uint8 i=0;i< uint8(BOARD_SIZE); i++){
        for(uint8 j=0;j< uint8(BOARD_SIZE); j++){
          board[i][j]=0;
    }
    }

    console.log("Initialize board");
  }

  event SpaceFilled(uint,uint,string);

  function mark(uint row, uint column) public {
    require(row <= 2 && column <= 2, "Out of board");
    require(board[row][column] == 0, "Space filled");
    require( status != GameStatus.finished, "Game finished");
    
    if(status == GameStatus.initial){
      status = GameStatus.ongoing;
    }

    board[row][column] = turn;
    string memory fill = turn == -1? "x":"o";
    emit SpaceFilled(row, column, fill);
    turn = turn == -1? int8(1):int8(-1);

    
    int8 winner = checkWinner();
    if(winner == 1 || winner == -1){
      console.log("GAME FINISHED");
      status = GameStatus.finished;
    }
    
  }

  function checkWinner() public view returns (int8){ //1 -1, 0

    for(uint8 i =0; i< uint8(BOARD_SIZE); i++){
      int8 rowSum = 0;
      int8 columnSum = 0;
      
      for(uint8 j =0; j< uint8(BOARD_SIZE); j++){
        rowSum+= board[i][j];
        columnSum+= board[j][i];
      }

      if(rowSum == -BOARD_SIZE || columnSum == -BOARD_SIZE) return -1; //x wins
      if(rowSum == BOARD_SIZE || columnSum == BOARD_SIZE) return 1; //o wins
    }

    int8 diag1Sum = 0;
    int8 diag2Sum = 0;
    for(uint8 k =0; k< 3; k++){
        diag1Sum += board[k][k]; //00 11 22
        diag2Sum += board[k][uint(uint8(BOARD_SIZE - 1)-k)]; //00 11 22 // 0,2 , 11, 20 ((size-1)-k) // 2 1 0
    }
    
    if(diag1Sum == -BOARD_SIZE || diag2Sum == -BOARD_SIZE) return -1; //x wins
    if(diag1Sum == BOARD_SIZE || diag2Sum == BOARD_SIZE) return 1; //o wins

    return 0;
  }

  


  //reset?

}