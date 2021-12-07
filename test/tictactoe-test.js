const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  const X = -1;
  const O = 1;
  
  it("Should initialize board on deploy", async function () {
    const TicTacToe = await ethers.getContractFactory("TicTacToe");
    const tictactoe = await TicTacToe.deploy();
    await tictactoe.deployed();
    
    expect(await tictactoe.board(0,0)).to.equal(0);
    expect(await tictactoe.board(2,2)).to.equal(0);

    await tictactoe.mark(0,0);
    expect(await tictactoe.board(0,0)).to.equal(X);

    await tictactoe.mark(0,1);
    expect(await tictactoe.board(0,1)).to.equal(O);

    await tictactoe.mark(1,1);
    expect(await tictactoe.board(1,1)).to.equal(X);

    try{
      await tictactoe.mark(1,1);
    } catch(err){
      expect(err.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Space filled'");
    }

    try{
      await tictactoe.mark(1,4);
    } catch(err){
      expect(err.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Out of board'");
    }

  });

  it("Should determine player x(-1) as winner", async function () {
    const TicTacToe = await ethers.getContractFactory("TicTacToe");
    const tictactoe = await TicTacToe.deploy();
    await tictactoe.deployed();

    expect(await tictactoe.checkWinner()).to.equal(0);
    await tictactoe.mark(0,0); // x -1
    await tictactoe.mark(0,1);
    await tictactoe.mark(1,1);
    await tictactoe.mark(2,1);
    await tictactoe.mark(2,2);
    expect(await tictactoe.checkWinner()).to.equal(-1);
  });

  it("Should determine player o(1) as winner", async function () { //Reversed diagonal 
    const TicTacToe = await ethers.getContractFactory("TicTacToe");
    const tictactoe = await TicTacToe.deploy();
    await tictactoe.deployed();

    expect(await tictactoe.checkWinner()).to.equal(0);
    await tictactoe.mark(0,0);
    await tictactoe.mark(0,2);
    await tictactoe.mark(0,1);
    await tictactoe.mark(1,1);
    await tictactoe.mark(1,0);
    await tictactoe.mark(2,0);

    expect(await tictactoe.checkWinner()).to.equal(1);
  });
  

  it("Should avoid mark after finished", async function () { //Reversed diagonal 
    const TicTacToe = await ethers.getContractFactory("TicTacToe");
    const tictactoe = await TicTacToe.deploy();
    await tictactoe.deployed();

    expect(await tictactoe.checkWinner()).to.equal(0);
    await tictactoe.mark(0,0);
    await tictactoe.mark(0,2);
    await tictactoe.mark(0,1);
    await tictactoe.mark(1,1);
    await tictactoe.mark(1,0);
    await tictactoe.mark(2,0); //O wins

    try{
      await tictactoe.mark(2,2); //X try to mark
    } catch(err){
      expect(err.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Game finished'");
    }
    expect(await tictactoe.checkWinner()).to.equal(1);





  });
});
