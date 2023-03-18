// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithRedirect,
    signInAnonymously,
    onAuthStateChanged,
    GoogleAuthProvider,
    signOut,
    inMemoryPersistence,
    setPersistence
} from "firebase/auth";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    updateDoc,
    addDoc,
    getDocs,
    onSnapshot,
    query,
    orderBy,
    increment,
} from "firebase/firestore";
import { html, render } from "lit-html";
import { sketch } from 'p5js-wrapper';

const firebaseConfig = {
    apiKey: "AIzaSyCw11jrqwWZZl24yqDBdLoS9H3OkNX8VCE",
    authDomain: "my-app-beb62.firebaseapp.com",
    projectId: "my-app-beb62",
    storageBucket: "my-app-beb62.appspot.com",
    messagingSenderId: "38292691836",
    appId: "1:38292691836:web:50df4ebe3462958c8822f9",
    measurementId: "G-MQXEPTYRKZ"
  };
  
  
  
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  console.log(db.toJSON)
  const ref = db.ref;
  console.log(ref)


  
  

var allBlocks = [];
var width = 0;
var height = 0;
var currColor = 0;
const gridWidth = 8;
const gridHeight = 8;
var gridStart = 0;
var diameter;
var newBlockChecker = false;
var newGameCheck = false
let button;
let gameOverButton = null;
var gameOverText = null;
var blocksStackedText = null;
var boolean = false;
var uid = 0;
var user = 0;
var auth = null;
var gameBoard = [];
var currBlock;
var firstGame = true;
var possibleBlocks = []

var numBlocksStacked = 0;

function getRandomInt(max) {
    return Math.floor(Math.random() * (max));
}



//Makes a new block for the user and stores the previous block into memory 
function makeNewBlock() {
    // generates a random color
    currBlock = {}

    currColor = generateRandomColor();
    fill(currColor)

    //generates a random starting position for the block
    let startingXPos = diameter * Math.round(getRandomInt(gridWidth - 4)) + gridStart;
    let randomBlockChooser = getRandomInt(6)
    
    currBlock = JSON.parse(JSON.stringify(possibleBlocks[randomBlockChooser]))
    currBlock.color = currColor

    for (let j = 0; j < currBlock.blocks.length; j++) {
        currBlock.blocks[j].xPos += startingXPos
        rect(currBlock.blocks[j].xPos, currBlock.blocks[j].yPos, diameter, diameter)
    }

    //}
}

function gameBoardUpdater() {
    let b = currBlock.blocks
    /*console.log(gameBoard)
    for (var j = 0; j < b.length; j++) {
        let blockYPos = b[j].yPos / diameter - 1
        let blockXPos = b[j].xPos / diameter
        for (var i = 0; i < gridWidth; i++) {
            console.log("[y: " + ", x: " + blockXPos + ", i " + i)
            if (blockYPos == 0 && gameBoard[1][i] && gameBoard[blockXPos] == i) {
                startNewGame();
                return;
            }
        }
    }*/
    for (let z = 0; z < b.length; z++) {
        let y = Math.ceil(b[z].yPos / diameter)
        let x = Math.ceil((b[z].xPos / diameter) - gridStart / diameter)

        if (y == gridHeight) {
            newBlockChecker = true;
        } else if (gameBoard[y][x]) {
            newBlockChecker = true;
        }
    }
    if (newBlockChecker) {
        newBlockChecker = false;
        numBlocksStacked++
        for (let j = 0; j < currBlock.blocks.length; j++) {
            let y2 = Math.round(currBlock.blocks[j].yPos / diameter) - 1
            let x2 = Math.round(currBlock.blocks[j].xPos / diameter - gridStart / diameter) 
            gameBoard[y2][x2] = true;
            if (y2 == 0) {
                startNewGame();
                return;
            }
        }
        allBlocks.push(currBlock)
        console.log(allBlocks)
        makeNewBlock();
        return;
    }


}


// Continously draws the gameboard on the canvas. Also checks if any blocks have reached the top 
// of the grid, and if so starts a new game
function drawGameBoard() {
    stroke(5);
    fill('gray')
    let y = 0;

    for (var i = 0; i < gridHeight; i++) {
        let x = gridStart;

        for (var j = 0; j < gridWidth; j++) {
            square(x, y, diameter);
            x += diameter;
        }

        y += diameter;
    }
}

function drawAllBlocks() {
    for (let i = 0; i < allBlocks.length; i++) {
        let blockItr = allBlocks[i];
        let coords = blockItr.blocks
        fill(blockItr.color)

        for (let j = 0; j < coords.length; j++) {
            rect(coords[j].xPos, coords[j].yPos - diameter, diameter, diameter)

        }
    }
}

//function to generate the 2d array representation of the gameboard
function generateGameboard() {
    gameBoard = new Array(gridHeight - 1);
    for (var i = 0; i < gridHeight; i++) {
        gameBoard[i] = new Array(gridWidth - 1);

        for (var j = 0; j < gridWidth; j++) {
            gameBoard[i][j] = false
        }

    }
    return gameBoard;
}

// prints out a string representation of the 2d array gameboard
function gameBoardToString(gameBoard) {
    for (var i = 0; i < gameBoard.length; i++) {
        for (var j = 0; j < gameBoard.length; j++) {
            console.log(gameBoard[i][j] + " ");
        }
        console.log("\n");
    }
}

function getMinMaxWithMath(arr){
    // Math.max(10,3,8,1,33)
    let maximum = Math.max(...arr);
    // Math.min(10,3,8,1,33)
    let minimum = Math.min(...arr);
   let result =  ([maximum, minimum]); 
    return result;
  };

function rotateBlock() {
    switch(currBlock.blockKey) {
        case 0:

            switch(currBlock.rotation) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break

            }

            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            break;
    }

        
};


// shifts the current block along the x-axis depending on user input
function shiftCurrBlock(shiftX) {

    // Figures out what the starting and ending x coordinaes of our block, 
    // used to check if shifting the block would move it out of the grids bounds
    let xArr = []
    let yArr = []
    for(let i = 0; i < currBlock.blocks.length; i++) {
        xArr.push(currBlock.blocks[i].xPos)
        yArr.push(currBlock.blocks[i].yPos)
    }
    let xResult = getMinMaxWithMath(xArr)
    let yResult = getMinMaxWithMath(yArr)

    let blockStartX = Math.ceil(xResult[1] / diameter - (gridStart / diameter))
    let blockEndX = Math.ceil((xResult[0] / diameter) - (gridStart / diameter))
    let bottomY = Math.ceil(yResult[0] / diameter - 1)

    if (((blockStartX != 0 && shiftX == -1) ||
        (blockEndX != gridWidth - 1 && shiftX == 1)) &&
        (bottomY != gridHeight && bottomY != gridHeight - 1) &&
        ((!gameBoard[bottomY + 1][blockEndX + 1] && shiftX == 1) ||
            (!gameBoard[bottomY + 1][blockStartX - 1] && shiftX == -1))) {



        drawGameBoard();
        frameRate(10)
        let blocks = currBlock.blocks
        var list = []
        var list2 = []
        for (var i = 0; i < blocks.length; i++) {
            list.push(blocks[i].xPos / diameter)
            blocks[i].xPos += diameter * shiftX
            list2.push(blocks[i].xPos / diameter)
            rect(blocks[i].xPos, blocks[i].yPos, diameter, diameter)
        }

        if (((gameBoard[bottomY - 1][blockEndX] && shiftX == 1) ||
            (gameBoard[bottomY - 1][blockStartX] && shiftX == -1))) {
            boolean = true;
            allBlocks.push(currBlock)
            makeNewBlock();
        }



    }
}

function generateRandomColor() {
    let h = Math.ceil(Math.random() * 255)
    let v = Math.ceil(Math.random() * 255)
    let s = Math.ceil(Math.random() * 255)
    return color(h, s, v)
}

function continueGame() {
    gameOverButton.hide()
    gameOverText.clear()
    makeNewBlock();
    numBlocksStacked = 0
    loop()
}




function startNewGame() {




    newGameCheck = false
    //drawGameBoard();
    currBlock = {};
    allBlocks = [];
    firstGame = false;

    
    for (let i = 0; i < gridHeight; i++) {

        for (let z = 0; z < gridWidth; z++) {
            gameBoard[i][z] = false
        }
    }


    var data = {
        'UID': uid,
        'name': user.displayName,
        'blocksStacked': numBlocksStacked + 1
      }
     const docRef = doc(collection(db, "users"), uid)
     updateDoc(docRef, {
        blocksStacked: increment(numBlocksStacked)
     })
     
    fill('black')
    gameOverText = text("GAME OVER", 100, windowHeight/4, 200, 200)
    blocksStackedText = text("You have stacked " + numBlocksStacked + " blocks this round!", 100, windowHeight/4 + 50, 150, 100)
    gameOverButton = createButton('Start new game');
    gameOverButton.position(100, windowHeight/4 + 200);
    gameOverButton.mousePressed(continueGame);
    noLoop()

    



}




/*keyPressed = (event) => {
    if (keyCode == 39) {
        shiftCurrBlock( 1)
    } else if (keyCode == 37) {
        shiftCurrBlock( -1)
    }
};*/

sketch.keyPressed = (event) => {
    if (keyCode == 39) {
        shiftCurrBlock(1)
    } else if (keyCode == 37) {
        shiftCurrBlock(-1)
    } 
};

function stop() {
    //startNewGame();
    sketch.noLoop();
}

sketch.setup = function () {
    createCanvas(windowWidth, windowHeight)
    gridStart = windowWidth / 3;
    gameBoard = generateGameboard();
    currColor = generateRandomColor()
    diameter = windowHeight / gridHeight;
    auth = getAuth(firebaseApp);

    console.log(gridStart)
    sketch.textSize(20);

    sketch.button = createButton('debugging tool');
    sketch.button.position(0, 0);
    sketch.button.mousePressed(stop);


    //Creates all possible blocks that could be spawned, these are based off of
    //the shape of the blocks in the tetris game

    //block 1

    let newBlock = {
        blocks: [],
        color: 0,
        blockKey: 0,
        rotation: 0
    }
    let singleBlock = {
        xPos: diameter * 2, 
        yPos: 0
    }
    newBlock.blocks.push(singleBlock)
    for (let i = 0; i < 3; i++) {
        singleBlock = {
            xPos: diameter * i, 
            yPos: diameter
        }
        newBlock.blocks.push(singleBlock)
    }
    possibleBlocks.push(newBlock)


    //block 2
    newBlock = {
        blocks: [],
        color: 0,
        blockKey: 1,
        rotation: 0
    }
    singleBlock = {
        xPos: 0, 
        yPos: 0
    }
    newBlock.blocks.push(singleBlock)
    for (let i = 0; i < 3; i++) {
        singleBlock = {
            xPos: diameter * i, 
            yPos: diameter
        }
        newBlock.blocks.push(singleBlock)
    }
    possibleBlocks.push(newBlock)

    //block 3
    newBlock = {
        blocks: [],
        color: 0,
        blockKey: 2,
        rotation: 0
    }
    newBlock.blocks.push(singleBlock)
    for (let i = 0; i < 2; i++) {
        singleBlock = {
            xPos: diameter * i, 
            yPos: 0
        }
        newBlock.blocks.push(singleBlock)
    }
    for (let i = 1; i < 3; i++) {
        singleBlock = {
            xPos: diameter * i, 
            yPos: diameter
        }
        newBlock.blocks.push(singleBlock)
    }
    possibleBlocks.push(newBlock)

    //block 4
    newBlock = {
        blocks: [],
        color: 0,
        blockKey: 3,
        rotation: 0
    }
    newBlock.blocks.push(singleBlock)
    for (let i = 0; i < 2; i++) {
        singleBlock = {
            xPos: diameter * i, 
            yPos: diameter
        }
        newBlock.blocks.push(singleBlock)
    }
    for (let i = 1; i < 3; i++) {
        singleBlock = {
            xPos: diameter * i, 
            yPos: 0
        }
        newBlock.blocks.push(singleBlock)
    }
    possibleBlocks.push(newBlock)

    //block 5
    newBlock = {
        blocks: [],
        color: 0,
        blockKey: 4,
        rotation: 0
    }
    for (let i = 0; i < 4; i++) {
        singleBlock = {
            xPos: diameter * i, 
            yPos: 0
        }
        newBlock.blocks.push(singleBlock)
    }
    possibleBlocks.push(newBlock)

    //block 6
    newBlock = {
        blocks: [],
        color: 0,
        blockKey: 5,
        rotation: 0
    }
    singleBlock = {
        xPos: diameter,
        yPos: 0
    }
    newBlock.blocks.push(singleBlock)
    for (let i = 0; i < 4; i++) {
        singleBlock = {
            xPos: diameter * i, 
            yPos: diameter
        }
        newBlock.blocks.push(singleBlock)
    }
    possibleBlocks.push(newBlock)

    //block 7
    newBlock = {
        blocks: [],
        color: 0,
        blockKey: 6,
        rotation: 0
    }
    for (let i = 0; i < 2; i++) {
        singleBlock = {
            xPos: diameter * i, 
            yPos: 0
        }
        newBlock.blocks.push(singleBlock)
    }
    for (let i = 0; i < 2; i++) {
        singleBlock = {
            xPos: diameter * i, 
            yPos: diameter
        }
        newBlock.blocks.push(singleBlock)
    }
    possibleBlocks.push(newBlock)
            
    console.log(possibleBlocks)
    console.log(diameter)


    drawGameBoard();
    makeNewBlock();
    
}


sketch.draw = function () {


    user = auth.currentUser
    if (user != null) {
        uid = user.uid
    }

    
    frameRate(1)
    drawGameBoard();
    drawAllBlocks();


    console.log(possibleBlocks)
    //creates the block the player is currently controlling and continuosly shifts it down
    let blocks = currBlock.blocks
    fill(currColor);

    if (!boolean) {
        boolean = false

        for (let i = 0; i < blocks.length; i++) {
            rect(blocks[i].xPos, blocks[i].yPos, diameter, diameter)
            blocks[i].yPos += diameter
        }
    }
    gameBoardUpdater();
}


