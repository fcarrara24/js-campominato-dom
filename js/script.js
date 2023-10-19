//game btn
const gameBtn = document.getElementById('generate')
const rangeListener = document.getElementById('difficulyRange');
let loadedPage = false

/**
 * label listener for changing difficulty
 */
rangeListener.addEventListener('input', function () {
    let difficultyShow = document.querySelector('#difficultyShow');
    let value = rangeListener.value;
    //ternary operator with simple comparator, so it dowsn't say false being different difficulty levels
    difficultyShow.innerText = (value == 8) ? 'difficle' : (((value == 9) ? 'medio' : 'facile'))
})


gameBtn.addEventListener('click', function newGame() {
    const table = document.getElementById('field');
    // recharge page if clicking twice on the btn
    if (loadedPage) {
        reload();
    }
    //1st execution
    loadedPage = true;
    let width
    width = document.getElementById('difficulyRange').value;
    console.log(width)
    //creating the table

    let firstClick = true;
    let win = false;
    //passiamo 16 mine
    let totalMines = 16;
    let matrixMines = mineMatrixAssigner(totalMines)
    let displayed = [];
    let totalDisplayed = 0;

    for (let i = 0; i < width; i++) {

        let displayedLine = [];
        for (let j = 0; j < width; j++) {

            table.innerHTML += `<div class="square" style="width: ${99 / width}%; height: ${99 / width}%;"></div>`
            let disp = false;
            //pushed for html
            displayedLine.push(disp);

        }

        displayed.push(displayedLine);

    }

    //getting all the squares

    const printSquare = document.getElementsByClassName('square');

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
            //left-click handler
            printSquare[i * width + j].addEventListener('click', (event) => {
                printSquare[i * width + j].classList.remove('circled');
                if (matrixMines[i][j] && !win) {
                    let arrayTotale = document.getElementsByClassName('square');
                    for (let x = 0; x < width; x++) {
                        for (let y = 0; y < width; y++) {
                            if (matrixMines[x][y]) {
                                arrayTotale[x * width + y].classList.remove('circled');
                                arrayTotale[x * width + y].classList.add('bomb')
                                arrayTotale[x * width + y].innerHTML = `<i class="fa-solid fa-bomb fa-bounce"></i>`
                                console.log('mines')
                            }
                        }
                    }
                    setTimeout(() => {
                        reload();
                    }, 3000);
                    alert('hai perso');


                } else {
                    crash(i, j, true);
                }
            })
            //right-click handler
            printSquare[i * width + j].addEventListener('contextmenu', (event) => {
                if (event.button == 2) {
                    event.preventDefault();
                    if (printSquare[i * width + j].innerHTML === '' || printSquare[i * width + j].innerHTML === ' ' || printSquare[i * width + j].innerHTML === '<div class="centered"></div>') {
                        printSquare[i * width + j].classList.toggle('circled');
                    }
                }
            })
        }

    }


    /**
     * recursive function to check adjscent lines, third value is the last iteraction ( so it shows also outer numbers of adjacent files)
     * @param {*} x 
     * @param {*} y 
     * @param {*} notLast 
     * @returns 
     */
    function crash(x, y, notLast) {
        displayed[x][y] = true;

        if (!matrixMines[x][y]) {
            //remove circeld class if previous assigned
            printSquare[x * width + y].classList.remove('circled');

            //displays background color white and inner value
            printSquare[x * width + y].style.backgroundColor = "white";
            printSquare[x * width + y].innerHTML = `<div class="centered">${printPoint(x, y)}</div>`

            //keep track of displayed mines for win-counter
            totalDisplayed = totalDisplayed + 1;
            //win condition
            if (totalMines === (width * width - totalDisplayed)) {
                let arrayTotale = document.getElementsByClassName('square');
                for (let x = 0; x < width; x++) {
                    for (let y = 0; y < width; y++) {
                        if (matrixMines[x][y]) {
                            arrayTotale[x * width + y].classList.remove('circled');
                            arrayTotale[x * width + y].classList.add('win')
                            arrayTotale[x * width + y].innerHTML = `<i class="fa-solid fa-trophy fa-beat-fade" style="color: #d6cf00;"></i>`
                            console.log('mines')
                        }
                    }
                }
                //toggles off mines
                win = true;
                console.log('hai vinto ');
                //document.getElementById('win').innerHTML = '<button class="btn btn-primary" onclick="reload()">hai vinto, premi per una nuova partita</button>'

            }
        }
        //if it is the last iteraction it stops
        if (notLast) {

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    // since the interacted part is already displayed, I don't have to put a condition like (i!===0 || j!===0)
                    if (inBounds(x + i, y + j) && !displayed[x + i][y + j]) {
                        //if assoign points is not 0, means that this is the last interaction (else it will reveal mines)
                        crash(x + i, y + j, assignPoints(x + i, y + j) === 0)
                    }

                }
            }


        }
        return;
    }


    /**
     * given the coords, it will display the number of adjacent mines or nothing if there are none
     * @param {*} x 
     * @param {*} y 
     * @returns 
     */
    function printPoint(x, y) {
        let value = assignPoints(x, y);
        if (value !== 0 && !matrixMines[x][y]) {
            return value
        }
        return '';
    }

    /**
     * assignpoints according to the nearby mines
     * @param {*} x 
     * @param {*} y 
     */
    function assignPoints(x, y) {
        let nearby = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (inBounds(x + i, y + j) && (matrixMines[x + i][y + j])) {
                    nearby++;
                }
            }
        }

        return nearby;
    }

    /**
     * checks it is in the array bounds
     */
    function inBounds(x, y) {
        return (x >= 0 && y >= 0 && x < width && y < width);
    }

    function mineMatrixAssigner(totalMines) {
        //output matrix
        let out = [];
        //array to handle data
        let maxineraction = 1000;
        let array = [];
        while (array.length < totalMines || maxineraction === 0) {
            extractedTile = rndInt(0, width * width - 1)
            if (!array.includes(extractedTile)) {
                array.push(extractedTile);
            }
            maxineraction--;
        }
        out = arrayToMatrix(array);
        return out;
    }

    function arrayToMatrix(array) {
        let checkCounter = 0;
        outMatrix = [];
        for (let i = 0; i < width; i++) {
            let outMatrixRow = [];
            for (j = 0; j < width; j++) {
                //checking if number already there
                if (array.includes(i * width + j)) {
                    //if there i push true to handle mines
                    outMatrixRow.push(true);
                    checkCounter++;
                } else {
                    outMatrixRow.push(false);
                }
            }
            outMatrix.push(outMatrixRow);
        }
        console.log('contatore di prova ' + checkCounter)
        return outMatrix;
    }
    /**
     * random integer
     * @param {*} min 
     * @param {*} max 
     * @returns 
     */
    function rndInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function reload() {
        table.innerHTML = ''
    }
});
