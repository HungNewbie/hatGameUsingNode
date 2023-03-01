const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
// clear the screen after every turn. 
// Run the command "npm install clear-screen" first before
// playing the game.
// Run node main.js in the terminal to start the game.
const clearScreen = require('clear-screen');

class Field {
    constructor(field = [[]]) {
        this.field = field;
        this.start = {x:0, y:0};
        this.hatPosition = {x:0, y:0};
        this.Xlocation = 0;
        this.Ylocation = 0;
    }

    print() {
        clearScreen();
        this.field.forEach(element => console.log(element.join('')));
    }
    // Define the controller base on user input. 
    // Please note, input must be capitalized.
    userInput() {
        const whichInput = prompt('WHICH WAY SHOULD I GO? W for up, S for down, A for left or D for right. ');
        switch (whichInput) {
            case 'W':
                this.Ylocation -= 1;
                break;
            case 'S':
                this.Ylocation += 1;
                break;
            case 'A':
                this.Xlocation -= 1;
                break;
            case 'D':
                this.Xlocation += 1;
                break;
            default:
                console.log('Please enter W for up, S for down, A for left or D for right');
                this.userInput();
                break;
        }
    }
    // define conditions to check if the player is inside the maze or not
    validPosition() {
        return (
            this.Xlocation >= 0 && this.Ylocation >= 0 &&
            this.Xlocation < this.field[0].length &&
            this.Ylocation < this.field.length
        )
    }
    // The condition to check if the player reach the hat
    reachHat() {
        return this.field[this.Ylocation][this.Xlocation] === hat;
    }
    //The condition to check if the player fall into a hole
    fallHole() {
        return this.field[this.Ylocation][this.Xlocation] === hole;
    }
    // Add more holes as the player move for the hard mode (should be random between 1 and 5)
    moreHoles() {
        const randomHoles = Math.floor(Math.random() *5)+1;
        for(let i = 1; i <= randomHoles; i++) {
            let holePosition = {x:0, y:0};
            do {
                holePosition = this.setPosition(this.hatPosition);
            } while (holePosition.x === this.Xlocation && holePosition.y === this.Ylocation)
            this.field[holePosition.y][holePosition.x] = hole;
        }
    }
    // .generateField() will take arguments for height and width of the field, as well as
    // percentage to determine what percent of the field should be covered in holes. 
    // This method should return a randomized two-dimensional array representing the field 
    // with a hat and one or more holes.
    static generateField(height, width, percentage = 0.1) {
        const field = new Array(height).fill(0).map(element => new Array(width));
        for (let y = 0; y< height; y++) {
            for (let x = 0; x< width; x++) {
                field[y][x] = Math.random() > percentage ? fieldCharacter : hole;
            }
        }
        return field;
    }
    //set a random field position that is not off-limit
    setPosition(offLimit = {x:0, y:0}) {
        const position = {x:0, y:0}
        do {
            position.x = Math.floor(Math.random() * this.field[0].length);
            position.y = Math.floor(Math.random() * this.field.length);
        } while (position.x === offLimit.x && position.y === offLimit.y)
        return position;
    } 
    // random starting position for the player
    startPosition() {
        this.start = this.setPosition();
        this.Xlocation = this.start.x;
        this.Ylocation = this.start.y;
        this.field[this.Ylocation][this.Xlocation] = pathCharacter;
    }
    //set location for hat
    setHatLocation() {
        this.hatPosition = this.setPosition(this.start);
        this.field[this.hatPosition.y][this.hatPosition.x] = hat;
    }
    // this one is for normal mode (hard mode not enable)
    gamePlay(hardMode = false) {
        // First, we set the initial position for the player
        this.startPosition();
        // Then we start the location for the hat
        this.setHatLocation();
        // Check the condition to see if the player is winning or not while moving.
        let play = true;
        while (play) {
            this.print();
            this.userInput();
            if(!this.validPosition()) {
                console.log('You move out of the the maze, try again!');
                play = false;
                break;
            } else if (this.fallHole()) {
                console.log('Oh no! You fall into a hole, you lose!');
                play = false;
                break;
            } else if (this.reachHat()) {
                console.log('You reach the hat, you win!');
                play = false;
                break;
            }
            // If player enable hard mode
            if(hardMode) {
                if (Math.random() > 0.2) {
                    this.moreHoles();
                }
            }
        //Update current location for the player
        this.field[this.Ylocation][this.Xlocation] = pathCharacter;
        }
    }
}
//const fieldNormal = new Field(Field.generateField(12,12,0.1), true);
//fieldNormal.gamePlay(true);
 const fieldHard = new Field(Field.generateField(15,15,0.2), true);
 fieldHard.gamePlay(true);